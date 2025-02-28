// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IAave.sol";

contract Vaquita {
    using SafeERC20 for IERC20;

    enum RoundStatus { Pending, Active, Completed }
    enum PaymentStatus { NotPaid, OnTime, Late }

    struct Turn {
        uint256 cutoffDate;
        mapping(address => PaymentStatus) playerPaymentStatus;
        mapping(address => uint256) paymentTimestamp;
        bool completed;
    }

    struct Round {
        uint256 paymentAmount;
        IERC20 token;
        uint8 numberOfPlayers;
        address[] players;
        uint256 totalAmountLocked;
        uint8 availableSlots;
        uint256 frequencyOfPayments;
        RoundStatus status;
        mapping(address => bool) withdrawnFunds;
        mapping(address => uint256) turnAccumulations;
        mapping(address => uint256) paidTurns;
        mapping(address => bool) withdrawnTurns;
        mapping(address => uint8) positions;
        uint256 startTimestamp;
        uint256 endTimestamp;
        mapping(uint8 => Turn) turns;
        uint256 totalInterestEarned;
        bool protocolFeeTaken;
    }

    mapping(bytes16 => Round) public _rounds;
    
    // Aave Pool contract for yield generation
    IPool public immutable aavePool;
    
    // Mapping from token to aToken
    mapping(address => address) public tokenToAToken;
    
    // Protocol owner
    address public owner;
    
    // Protocol fees accumulated per token
    mapping(address => uint256) public protocolFees;

    error RoundAlreadyExists();
    error RoundNotPending();
    error RoundFull();
    error RoundNotActive();
    error CannotPayOwnTurn();
    error TurnAlreadyPaid();
    error InvalidTurn();
    error RoundNotCompleted();
    error TurnAlreadyWithdrawn();
    error InsufficientFunds();
    error FundsAlreadyWithdrawn();
    error InvalidPosition();
    error InvalidAToken();
    error NotOwner();
    error ZeroAddress();

    event RoundInitialized(bytes16 indexed roundId, address initializer);
    event PlayerAdded(bytes16 indexed roundId, address player, uint8 position);
    event TurnPaid(bytes16 indexed roundId, address payer, uint8 turn, PaymentStatus status);
    event TurnWithdrawn(bytes16 indexed roundId, address player, uint256 amount);
    event FundsWithdrawn(bytes16 indexed roundId, address player, uint256 collateralAmount, uint256 interestAmount);
    event ATokenRegistered(address token, address aToken);
    event ProtocolFeeWithdrawn(address token, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    constructor(address _aavePool) {
        aavePool = IPool(_aavePool);
        owner = msg.sender;
    }

    function registerAToken(address token, address aToken) external onlyOwner {
        // Verify that aToken's underlying asset is the token
        IAToken aTokenContract = IAToken(aToken);
        if (aTokenContract.UNDERLYING_ASSET_ADDRESS() != token) {
            revert InvalidAToken();
        }
        
        tokenToAToken[token] = aToken;
        emit ATokenRegistered(token, aToken);
    }

    function initializeRound(
        bytes16 roundId,
        uint256 paymentAmount,
        IERC20 token,
        uint8 numberOfPlayers,
        uint256 frequencyOfPayments
    ) external {
        if (address(_rounds[roundId].token) != address(0)) {
            revert RoundAlreadyExists();
        }

        Round storage round = _rounds[roundId];

        round.paymentAmount = paymentAmount;
        round.token = token;
        round.numberOfPlayers = numberOfPlayers;
        round.totalAmountLocked = 0;
        round.availableSlots = numberOfPlayers;
        round.frequencyOfPayments = frequencyOfPayments;
        round.status = RoundStatus.Pending;
        round.startTimestamp = block.timestamp;

        uint256 amountToLock = paymentAmount * numberOfPlayers;
        token.safeTransferFrom(msg.sender, address(this), amountToLock);

        // Generate random position for the player
        uint8 position = _getRandomPosition(numberOfPlayers, roundId);
        
        round.players.push(msg.sender);
        round.positions[msg.sender] = position;
        round.totalAmountLocked += amountToLock;
        round.availableSlots--;

        // Setup cutoff dates for each turn
        for (uint8 i = 0; i < numberOfPlayers; i++) {
            round.turns[i].cutoffDate = round.startTimestamp + (i + 1) * frequencyOfPayments;
        }

        // Supply to Aave if aToken is registered
        _supplyToAave(token, amountToLock);

        emit RoundInitialized(roundId, msg.sender);
        emit PlayerAdded(roundId, msg.sender, position);
    }

    function addPlayer(bytes16 roundId) external {
        Round storage round = _rounds[roundId];
        if (round.status != RoundStatus.Pending) {
            revert RoundNotPending();
        }
        if (round.availableSlots == 0) {
            revert RoundFull();
        }

        uint256 amountToLock = round.paymentAmount * round.numberOfPlayers;
        round.token.safeTransferFrom(msg.sender, address(this), amountToLock);

        // Generate random position for the player
        uint8 position = _getRandomPosition(round.numberOfPlayers, roundId);
        
        // Ensure position is not already taken
        for (uint8 i = 0; i < round.players.length; i++) {
            if (round.positions[round.players[i]] == position) {
                // If position is taken, find the next available one
                position = (position + 1) % round.numberOfPlayers;
                i = 0; // restart the check
            }
        }

        round.players.push(msg.sender);
        round.positions[msg.sender] = position;
        round.totalAmountLocked += amountToLock;
        round.availableSlots--;

        // Supply to Aave if aToken is registered
        _supplyToAave(round.token, amountToLock);

        if (round.availableSlots == 0) {
            round.status = RoundStatus.Active;
        }

        emit PlayerAdded(roundId, msg.sender, position);
    }

    function payTurn(bytes16 roundId, uint8 turn) external {
        Round storage round = _rounds[roundId];
        if (round.status != RoundStatus.Active) {
            revert RoundNotActive();
        }
        if (round.positions[msg.sender] == turn) {
            revert CannotPayOwnTurn();
        }
        if ((round.paidTurns[msg.sender] & (1 << turn)) != 0) {
            revert TurnAlreadyPaid();
        }

        address recipient = address(0);
        for (uint8 i = 0; i < round.players.length; i++) {
            if (round.positions[round.players[i]] == turn) {
                recipient = round.players[i];
                break;
            }
        }
        if (recipient == address(0)) {
            revert InvalidTurn();
        }

        round.token.safeTransferFrom(msg.sender, address(this), round.paymentAmount);

        // Determine payment status based on current time and turn cutoff date
        PaymentStatus status;
        if (block.timestamp <= round.turns[turn].cutoffDate) {
            status = PaymentStatus.OnTime;
        } else {
            status = PaymentStatus.Late;
        }

        // Record payment status and timestamp
        round.turns[turn].playerPaymentStatus[msg.sender] = status;
        round.turns[turn].paymentTimestamp[msg.sender] = block.timestamp;

        round.turnAccumulations[recipient] += round.paymentAmount;
        round.paidTurns[msg.sender] |= 1 << turn;

        // Check if this turn is now completed (all players except the recipient have paid)
        uint256 expectedPayments = round.numberOfPlayers - 1;
        uint256 actualPayments = 0;
        for (uint8 i = 0; i < round.players.length; i++) {
            if (round.players[i] != recipient && ((round.paidTurns[round.players[i]] & (1 << turn)) != 0)) {
                actualPayments++;
            }
        }
        
        if (actualPayments == expectedPayments) {
            round.turns[turn].completed = true;
        }

        // Check if all turns are completed
        bool allTurnsCompleted = true;
        for (uint8 i = 0; i < round.numberOfPlayers; i++) {
            if (!round.turns[i].completed) {
                allTurnsCompleted = false;
                break;
            }
        }
        
        if (allTurnsCompleted) {
            round.status = RoundStatus.Completed;
            round.endTimestamp = block.timestamp;
            
            // Calculate total interest earned from Aave
            round.totalInterestEarned = _calculateTotalInterest(round.token, round.totalAmountLocked);
            
            // Withdraw all funds from Aave including interest
            address aTokenAddress = tokenToAToken[address(round.token)];
            if (aTokenAddress != address(0)) {
                IAToken aToken = IAToken(aTokenAddress);
                uint256 aTokenBalance = aToken.balanceOf(address(this));
                if (aTokenBalance > 0) {
                    aavePool.withdraw(address(round.token), aTokenBalance, address(this));
                }
            }
            
            // Calculate and track protocol fee
            uint256 protocolFee = (round.totalInterestEarned * 10) / 100;
            protocolFees[address(round.token)] += protocolFee;
            round.protocolFeeTaken = true;
        }

        emit TurnPaid(roundId, msg.sender, turn, status);
    }

    function withdrawTurn(bytes16 roundId) external {
        Round storage round = _rounds[roundId];
        if (round.status != RoundStatus.Active && round.status != RoundStatus.Completed) {
            revert RoundNotActive();
        }
        if (round.withdrawnTurns[msg.sender]) {
            revert TurnAlreadyWithdrawn();
        }

        uint256 expectedAmount = round.paymentAmount * (round.numberOfPlayers - 1);
        if (round.turnAccumulations[msg.sender] != expectedAmount) {
            revert InsufficientFunds();
        }

        // Turn payments are not stored in Aave, so we can directly transfer
        round.token.safeTransfer(msg.sender, expectedAmount);
        round.withdrawnTurns[msg.sender] = true;

        emit TurnWithdrawn(roundId, msg.sender, expectedAmount);
    }

    function withdrawFunds(bytes16 roundId) external {
        Round storage round = _rounds[roundId];
        if (round.status != RoundStatus.Completed) {
            revert RoundNotCompleted();
        }
        if (round.withdrawnFunds[msg.sender]) {
            revert FundsAlreadyWithdrawn();
        }

        // Calculate collateral amount
        uint256 collateralAmount = round.paymentAmount * round.numberOfPlayers;
        
        // Calculate interest amount based on payment behavior
        uint256 interestAmount = _calculatePlayerInterest(roundId, msg.sender);
        
        // No need to track protocol fee here, it's already handled when the round completes
        
        // No need to withdraw from Aave, as funds are already in the contract
        uint256 totalWithdraw = collateralAmount + interestAmount;

        // Transfer both collateral and interest
        round.token.safeTransfer(msg.sender, totalWithdraw);
        round.withdrawnFunds[msg.sender] = true;

        emit FundsWithdrawn(roundId, msg.sender, collateralAmount, interestAmount);
    }

    function getRoundInfo(bytes16 roundId) external view returns (
        uint256 paymentAmount,
        address tokenAddress,
        uint8 numberOfPlayers,
        uint256 totalAmountLocked,
        uint8 availableSlots,
        uint256 frequencyOfPayments,
        RoundStatus status
    ) {
        Round storage round = _rounds[roundId];
        return (
            round.paymentAmount,
            address(round.token),
            round.numberOfPlayers,
            round.totalAmountLocked,
            round.availableSlots,
            round.frequencyOfPayments,
            round.status
        );
    }

    function getTurnCutoffDate(bytes16 roundId, uint8 turn) external view returns (uint256) {
        return _rounds[roundId].turns[turn].cutoffDate;
    }

    function getPlayerPosition(bytes16 roundId, address player) external view returns (uint8) {
        return _rounds[roundId].positions[player];
    }

    function getPaymentStatus(bytes16 roundId, uint8 turn, address player) external view returns (PaymentStatus) {
        return _rounds[roundId].turns[turn].playerPaymentStatus[player];
    }

    function _getRandomPosition(uint8 numberOfPlayers, bytes16 roundId) internal view returns (uint8) {
        uint256 randomSeed = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, roundId)));
        return uint8(randomSeed % numberOfPlayers);
    }

    function _supplyToAave(IERC20 token, uint256 amount) internal {
        address aTokenAddress = tokenToAToken[address(token)];
        if (aTokenAddress != address(0)) {
            // Approve Aave pool to spend the tokens
            SafeERC20.forceApprove(token, address(aavePool), amount);
            
            // Supply to Aave
            aavePool.supply(address(token), amount, address(this), 0);
        }
    }

    function _withdrawFromAave(IERC20 token, uint256 amount) internal {
        address aTokenAddress = tokenToAToken[address(token)];
        if (aTokenAddress != address(0)) {
            // Withdraw from Aave
            aavePool.withdraw(address(token), amount, address(this));
        }
    }

    function _calculateTotalInterest(IERC20 token, uint256 principalAmount) internal view returns (uint256) {
        address aTokenAddress = tokenToAToken[address(token)];
        if (aTokenAddress == address(0)) {
            return 0; // No aToken registered for this token
        }
        
        // Get current aToken balance
        IAToken aToken = IAToken(aTokenAddress);
        uint256 aTokenBalance = aToken.balanceOf(address(this));
        
        // Interest is the difference between aToken balance and principal
        if (aTokenBalance > principalAmount) {
            return aTokenBalance - principalAmount;
        }
        return 0;
    }

    function _calculatePlayerInterest(bytes16 roundId, address player) internal view returns (uint256) {
        Round storage round = _rounds[roundId];
        
        if (round.totalInterestEarned == 0) {
            return 0;
        }
        
        // First, reserve 10% of total interest as protocol profit
        uint256 protocolFee = (round.totalInterestEarned * 10) / 100;
        uint256 distributableInterest = round.totalInterestEarned - protocolFee;
        
        // Get player's position (lower positions receive funds earlier)
        uint8 playerPosition = round.positions[player];
        
        // Position-based adjustment: higher positions get more interest
        // Formula: position weight = (position + 1) / sum of all positions
        // This creates a linear distribution where higher positions get more
        uint256 positionWeight = 0;
        uint256 totalWeight = 0;
        
        // Calculate sum of all position weights (1 + 2 + 3 + ... + numberOfPlayers)
        // This is the arithmetic sum formula: n(n+1)/2
        totalWeight = (round.numberOfPlayers * (round.numberOfPlayers + 1)) / 2;
        
        // Calculate this player's position weight
        positionWeight = playerPosition + 1;
        
        // Base interest is weighted by position
        uint256 baseInterest = (distributableInterest * positionWeight) / totalWeight;
        
        // Calculate bonus/penalty based on payment behavior
        uint256 bonusPenaltyFactor = 100; // 100% = no bonus/penalty
        
        // Skip player's own turn when calculating bonus/penalty
        for (uint8 i = 0; i < round.numberOfPlayers; i++) {
            if (i == playerPosition) {
                continue; // Skip own turn
            }
            
            PaymentStatus status = round.turns[i].playerPaymentStatus[player];
            if (status == PaymentStatus.OnTime) {
                // Bonus for on-time payments: +5% per turn
                bonusPenaltyFactor += 5;
            } else if (status == PaymentStatus.Late) {
                // Penalty for late payments based on how late
                uint256 lateness = round.turns[i].paymentTimestamp[player] - round.turns[i].cutoffDate;
                uint256 daysLate = lateness / 86400; // Convert to days
                
                // Penalty: -2% per day late, capped at -20% per turn
                uint256 penalty = daysLate * 2;
                if (penalty > 20) {
                    penalty = 20;
                }
                
                bonusPenaltyFactor -= penalty;
            }
        }
        
        // Ensure we don't go below 50% of base interest
        if (bonusPenaltyFactor < 50) {
            bonusPenaltyFactor = 50;
        }
        
        // Apply bonus/penalty factor to base interest
        return (baseInterest * bonusPenaltyFactor) / 100;
    }

    function withdrawProtocolFee(address token) external onlyOwner {
        uint256 fee = protocolFees[token];
        protocolFees[token] = 0;
        IERC20(token).safeTransfer(msg.sender, fee);
        emit ProtocolFeeWithdrawn(token, fee);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) {
            revert ZeroAddress();
        }
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}