// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin-contracts/token/ERC20/IERC20.sol";
import "@openzeppelin-contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin-contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin-contracts-upgradeable/proxy/utils/Initializable.sol";
import "./interfaces/IL2Pool.sol";
import "./interfaces/IAave.sol";

/**
 * @title VaquitaL2Upgradeable
 * @dev Upgradeable implementation of VaquitaL2
 */
contract VaquitaL2Upgradeable is Initializable, OwnableUpgradeable {
    using SafeERC20 for IERC20;

    enum RoundStatus { Pending, Active, Completed }
    enum PaymentStatus { NotPaid, OnTime, Late }

    struct Turn {
        uint cutoffDate;
        mapping(address => PaymentStatus) playerPaymentStatus;
        mapping(address => uint) paymentTimestamp;
        bool completed;
    }

    struct Round {
        uint paymentAmount;
        IERC20 token;
        uint numberOfPlayers;
        address[] players;
        uint totalAmountLocked;
        uint availableSlots;
        uint frequencyOfPayments;
        RoundStatus status;
        mapping(address => bool) withdrawnFunds;
        mapping(address => uint) turnAccumulations;
        mapping(address => uint) paidTurns;
        mapping(address => bool) withdrawnTurns;
        mapping(address => uint) positions;
        mapping(uint => bool) takenPositions;  // New mapping to track taken positions
        uint startTimestamp;
        uint endTimestamp;
        mapping(uint => Turn) turns;
        uint totalInterestEarned;
        uint protocolFee;
        bool protocolFeeTaken;
    }

    mapping(uint => Round) internal _rounds;
    
    // Mapping from token to aToken
    mapping(address => address) public aTokens;
    
    // Protocol fees accumulated per token
    mapping(address => uint) public protocolFees;
    
    // Mapping to store pre-calculated interest amounts for each player
    mapping(uint => mapping(address => uint)) internal _playerInterestAmounts;
    
    // Aave L2Pool contract for yield generation
    IL2Pool public aavePool;
    

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
    error PositionNotFound();

    event RoundInitialized(uint indexed roundId, address initializer);
    event PlayerAdded(uint indexed roundId, address player, uint position);
    event TurnPaid(uint indexed roundId, address payer, uint turn, PaymentStatus status);
    event TurnWithdrawn(uint indexed roundId, address player, uint amount);
    event FundsWithdrawn(uint indexed roundId, address player, uint collateralAmount, uint interestAmount);
    event ATokenRegistered(address token, address aToken);
    event ProtocolFeeWithdrawn(address token, uint amount);
    // OwnershipTransferred event is already defined in OwnableUpgradeable

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the contract
     * @param _aavePool Address of the Aave L2Pool contract
     */
    function initialize(address _aavePool) external initializer {
        __Ownable_init(msg.sender);
        aavePool = IL2Pool(_aavePool);
    }

    /**
     * @dev Registers an aToken for a token
     * @param token Address of the token
     * @param aToken Address of the aToken
     */
    function registerAToken(address token, address aToken) external onlyOwner {
        // Verify that aToken's underlying asset is the token
        IAToken aTokenContract = IAToken(aToken);
        if (aTokenContract.UNDERLYING_ASSET_ADDRESS() != token) {
            revert InvalidAToken();
        }
        
        aTokens[token] = aToken;
        
        emit ATokenRegistered(token, aToken);
    }

    /**
     * @dev Initializes a new round
     * @param roundId ID of the round
     * @param paymentAmount Amount each player pays per turn
     * @param token Token used for payments
     * @param numberOfPlayers Total number of players in the round
     * @param frequencyOfPayments Frequency of payments in seconds
     */
    function initializeRound(
        uint roundId,
        uint paymentAmount,
        IERC20 token,
        uint numberOfPlayers,
        uint frequencyOfPayments
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

        uint amountToLock = paymentAmount * (numberOfPlayers - 1);
        token.safeTransferFrom(msg.sender, address(this), amountToLock);

        // Generate random position for the player
        uint position = _getRandomPosition(numberOfPlayers, roundId);
        
        round.players.push(msg.sender);
        round.positions[msg.sender] = position;
        round.takenPositions[position] = true;
        round.totalAmountLocked += amountToLock;
        round.availableSlots--;

        // Setup cutoff dates for each turn
        for (uint i = 0; i < numberOfPlayers; i++) {
            round.turns[i].cutoffDate = round.startTimestamp + (i + 1) * frequencyOfPayments;
        }

        // Supply to Aave if aToken is registered
        _supplyToAave(token, amountToLock);

        emit RoundInitialized(roundId, msg.sender);
        emit PlayerAdded(roundId, msg.sender, position);
    }

    /**
     * @dev Adds a player to a round
     * @param roundId ID of the round
     */
    function addPlayer(uint roundId) external {
        Round storage round = _rounds[roundId];
        if (round.status != RoundStatus.Pending) {
            revert RoundNotPending();
        }
        if (round.availableSlots == 0) {
            revert RoundFull();
        }

        uint amountToLock = round.paymentAmount * (round.numberOfPlayers - 1);
        round.token.safeTransferFrom(msg.sender, address(this), amountToLock);

        // Find an available position starting from a random position
        uint position = _getRandomPosition(round.numberOfPlayers, roundId);
        uint originalPosition = position;
        bool positionFound = false;
        
        do {
            if (!round.takenPositions[position]) {
                round.takenPositions[position] = true;
                positionFound = true;
                break;
            }
            position = (position + 1) % round.numberOfPlayers;
        } while (position != originalPosition);

        if (!positionFound) {
            revert PositionNotFound();
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

    /**
     * @dev Pays a turn
     * @param roundId ID of the round
     */
    function payTurn(uint roundId) external {
        Round storage round = _rounds[roundId];
        uint position = round.positions[msg.sender];
        uint turn = _findNextTurn(round.paidTurns[msg.sender], round.numberOfPlayers, position);
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
        for (uint i = 0; i < round.players.length; i++) {
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
        uint expectedPayments = round.numberOfPlayers - 1;
        uint actualPayments = 0;
        for (uint i = 0; i < round.players.length; i++) {
            if (round.players[i] != recipient && ((round.paidTurns[round.players[i]] & (1 << turn)) != 0)) {
                actualPayments++;
            }
        }
        
        if (actualPayments == expectedPayments) {
            round.turns[turn].completed = true;
        }

        // Check if all turns are completed
        bool allTurnsCompleted = true;
        for (uint i = 0; i < round.numberOfPlayers; i++) {
            if (!round.turns[i].completed) {
                allTurnsCompleted = false;
                break;
            }
        }
        
        if (allTurnsCompleted) {
            round.status = RoundStatus.Completed;
        }

        emit TurnPaid(roundId, msg.sender, turn, status);
    }

    /**
     * @dev Withdraws a turn
     * @param roundId ID of the round
     */
    function withdrawTurn(uint roundId) external {
        Round storage round = _rounds[roundId];
        if (round.status != RoundStatus.Active && round.status != RoundStatus.Completed) {
            revert RoundNotActive();
        }
        if (round.withdrawnTurns[msg.sender]) {
            revert TurnAlreadyWithdrawn();
        }

        uint expectedAmount = round.paymentAmount * (round.numberOfPlayers - 1);
        if (round.turnAccumulations[msg.sender] != expectedAmount) {
            revert InsufficientFunds();
        }

        // Turn payments are not stored in Aave, so we can directly transfer
        round.token.safeTransfer(msg.sender, expectedAmount);
        round.withdrawnTurns[msg.sender] = true;

        emit TurnWithdrawn(roundId, msg.sender, expectedAmount);
    }

    /**
     * @dev Withdraws funds from a completed round
     * @param roundId ID of the round
     */
    function withdrawFunds(uint roundId) external {
        Round storage round = _rounds[roundId];
        if (round.status != RoundStatus.Completed) {
            revert RoundNotCompleted();
        }
        if (round.withdrawnFunds[msg.sender]) {
            revert FundsAlreadyWithdrawn();
        }
        
        // Clear position when withdrawing funds
        round.takenPositions[round.positions[msg.sender]] = false;
        
        // If this is the first withdrawal, calculate and distribute interest
        if (!round.protocolFeeTaken) {
            round.endTimestamp = block.timestamp;
            // Calculate total interest earned from Aave
            round.totalInterestEarned = _calculateTotalInterest(round.token, round.totalAmountLocked);
            
            // Withdraw all funds from Aave including interest
            address aTokenAddress = aTokens[address(round.token)];
            if (aTokenAddress != address(0)) {
                IAToken aToken = IAToken(aTokenAddress);
                uint aTokenBalance = aToken.balanceOf(address(this));
                if (aTokenBalance > 0) {
                    _withdrawFromAave(round.token, aTokenBalance);
                }
            }
            
            // Calculate and track protocol fee
            uint protocolFee = (round.totalInterestEarned * 10) / 100;
            protocolFees[address(round.token)] += protocolFee;
            round.protocolFee = protocolFee;
            round.protocolFeeTaken = true;
            
            // Pre-calculate interest distribution factors for all players
            _calculateInterestDistribution(roundId);
        }

        // Calculate collateral amount
        uint collateralAmount = round.paymentAmount * (round.numberOfPlayers - 1);
        
        // Calculate interest amount based on payment behavior
        uint interestAmount = _calculatePlayerInterest(roundId, msg.sender);
        
        // Transfer both collateral and interest
        uint totalWithdraw = collateralAmount + interestAmount;
        round.token.safeTransfer(msg.sender, totalWithdraw);
        round.withdrawnFunds[msg.sender] = true;

        emit FundsWithdrawn(roundId, msg.sender, collateralAmount, interestAmount);
    }

    /**
     * @dev Returns information about a round
     * @param roundId ID of the round
     * @return paymentAmount The amount each player pays per turn
     * @return tokenAddress The address of the token used in the round
     * @return numberOfPlayers The total number of players in the round
     * @return totalAmountLocked The total amount locked in the round
     * @return availableSlots The number of available slots in the round
     * @return frequencyOfPayments The frequency of payments in seconds
     * @return status The status of the round
     */
    function getRoundInfo(uint roundId) external view returns (
        uint paymentAmount,
        address tokenAddress,
        uint numberOfPlayers,
        uint totalAmountLocked,
        uint availableSlots,
        uint frequencyOfPayments,
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

    /**
     * @dev Returns the cutoff date for a turn
     * @param roundId ID of the round
     * @param turn The turn number
     * @return The cutoff date for the turn
     */
    function getTurnCutoffDate(uint roundId, uint turn) external view returns (uint) {
        return _rounds[roundId].turns[turn].cutoffDate;
    }

    /**
     * @dev Returns the position of a player in a round
     * @param roundId ID of the round
     * @param player Address of the player
     * @return The position of the player
     */
    function getPlayerPosition(uint roundId, address player) external view returns (uint) {
        return _rounds[roundId].positions[player];
    }

    /**
     * @dev Returns the payment status of a player for a turn
     * @param roundId ID of the round
     * @param turn The turn number
     * @param player Address of the player
     * @return The payment status
     */
    function getPaymentStatus(uint roundId, uint turn, address player) external view returns (PaymentStatus) {
        return _rounds[roundId].turns[turn].playerPaymentStatus[player];
    }

    /**
     * @dev Supplies tokens to Aave
     * @param token Token to supply
     * @param amount Amount to supply
     */
    function _supplyToAave(IERC20 token, uint amount) internal {
        address aTokenAddress = aTokens[address(token)];
        
        if (aTokenAddress != address(0)) {
            // Approve Aave pool to spend the tokens
            SafeERC20.forceApprove(token, address(aavePool), amount);
            
            // Supply to Aave
            aavePool.supply(
                address(token),
                amount,
                address(this), // onBehalfOf
                0 // referralCode
            );
        }
    }

    /**
     * @dev Withdraws tokens from Aave
     * @param token Token to withdraw
     * @param amount Amount to withdraw
     */
    function _withdrawFromAave(IERC20 token, uint amount) internal {
        address aTokenAddress = aTokens[address(token)];
        
        if (aTokenAddress != address(0)) {
            // Withdraw from Aave
            aavePool.withdraw(
                address(token),
                amount,
                address(this) // to
            );
        }
    }

    /**
     * @dev Calculates the total interest earned
     * @param token Token to calculate interest for
     * @param principalAmount Principal amount
     * @return Total interest earned
     */
    function _calculateTotalInterest(IERC20 token, uint principalAmount) internal view returns (uint) {
        address aTokenAddress = aTokens[address(token)];
        if (aTokenAddress == address(0)) {
            return 0; // No aToken registered for this token
        }
        
        // Get current aToken balance
        IAToken aToken = IAToken(aTokenAddress);
        uint aTokenBalance = aToken.balanceOf(address(this));
        
        // Interest is the difference between aToken balance and principal
        if (aTokenBalance > principalAmount) {
            return aTokenBalance - principalAmount;
        }
        return 0;
    }
    
    /**
     * @dev Calculates the interest distribution for a round
     * @param roundId ID of the round
     */
    function _calculateInterestDistribution(uint roundId) internal {
        Round storage round = _rounds[roundId];
        
        if (round.totalInterestEarned == 0) {
            return;
        }
        
        // First, reserve 10% of total interest as protocol profit
        uint protocolFee = round.protocolFee;
        uint distributableInterest = round.totalInterestEarned - protocolFee;
        
        // Calculate total weight for position-based distribution
        uint totalPositionWeight = (round.numberOfPlayers * (round.numberOfPlayers + 1)) / 2;
        
        // Calculate raw interest amounts based on position and payment behavior
        uint[] memory rawInterestAmounts = new uint[](round.numberOfPlayers);
        uint totalRawInterest = 0;
        
        for (uint i = 0; i < round.numberOfPlayers; i++) {
            address player = round.players[i];
            uint playerPosition = round.positions[player];
            
            // Position weight (higher positions get more)
            uint positionWeight = playerPosition + 1;
            
            // Base interest is weighted by position
            uint baseInterest = (distributableInterest * positionWeight) / totalPositionWeight;
            
            // Calculate bonus/penalty based on payment behavior
            uint bonusPenaltyFactor = 100; // 100% = no bonus/penalty
            
            // Skip player's own turn when calculating bonus/penalty
            for (uint j = 0; j < round.numberOfPlayers; j++) {
                if (j == playerPosition) {
                    continue; // Skip own turn
                }
                
                PaymentStatus status = round.turns[j].playerPaymentStatus[player];
                if (status == PaymentStatus.OnTime) {
                    // Bonus for on-time payments: +5% per turn
                    bonusPenaltyFactor += 5;
                } else if (status == PaymentStatus.Late) {
                    // Penalty for late payments based on how late
                    uint lateness = round.turns[j].paymentTimestamp[player] - round.turns[j].cutoffDate;
                    uint daysLate = lateness / 86400; // Convert to days
                    
                    // Penalty: -2% per day late, capped at -20% per turn
                    uint penalty = daysLate * 2;
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
            rawInterestAmounts[i] = (baseInterest * bonusPenaltyFactor) / 100;
            totalRawInterest += rawInterestAmounts[i];
        }
        
        // Normalize the interest amounts to ensure the total equals distributableInterest
        for (uint i = 0; i < round.numberOfPlayers; i++) {
            address player = round.players[i];
            
            // If totalRawInterest is 0, distribute equally
            if (totalRawInterest == 0) {
                _playerInterestAmounts[roundId][player] = distributableInterest / round.numberOfPlayers;
            } else {
                // Scale the raw interest amount to ensure total equals distributableInterest
                _playerInterestAmounts[roundId][player] = (rawInterestAmounts[i] * distributableInterest) / totalRawInterest;
            }
        }
    }
    
    /**
     * @dev Calculates the interest for a player
     * @param roundId ID of the round
     * @param player Address of the player
     * @return Interest amount
     */
    function _calculatePlayerInterest(uint roundId, address player) internal view returns (uint) {
        // Return the pre-calculated interest amount for this player
        return _playerInterestAmounts[roundId][player];
    }

    /**
     * @dev Calculates the next turn that a player needs to pay
     * @param number Bitmap of turns already paid
     * @param numberOfPlayers Total number of players in the round
     * @param position Player's position in the round
     * @return The next turn to pay
     */
    function _findNextTurn(uint number, uint numberOfPlayers, uint position) internal pure returns (uint) {
        for (uint i = 0; i < numberOfPlayers; i++) {
            if ((number & (1 << i)) == 0 && i != position) return i;
        }
        return numberOfPlayers; // No 0 found, return highest position in range
    }

    /**
     * @dev Generates a random position for a player
     * @param numberOfPlayers Total number of players in the round
     * @param roundId ID of the round
     * @return A random position
     */
    function _getRandomPosition(uint numberOfPlayers, uint roundId) internal view returns (uint) {
        uint randomSeed = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, roundId)));
        return uint(randomSeed % numberOfPlayers);
    }

    /**
     * @dev Withdraws protocol fees
     * @param token Address of the token to withdraw fees for
     */
    function withdrawProtocolFee(address token) external onlyOwner {
        uint fee = protocolFees[token];
        protocolFees[token] = 0;
        IERC20(token).safeTransfer(msg.sender, fee);
        emit ProtocolFeeWithdrawn(token, fee);
    }

    /**
     * @dev Returns the L2 pool address
     * @return The L2 pool address
     */
    function getL2Pool() external view returns (address) {
        return address(aavePool);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
} 