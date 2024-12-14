// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Vaquita {
    using SafeERC20 for IERC20;

    enum RoundStatus { Pending, Active, Completed }

    struct Round {
        uint256 paymentAmount;
        IERC20 token;
        uint8 numberOfPlayers;
        address[] players;
        uint256 totalAmountLocked;
        uint8 availableSlots;
        uint256 frequencyOfTurns;
        RoundStatus status;
        mapping(address => bool) withdrawnCollateral;
        mapping(address => uint256) turnAccumulations;
        mapping(address => uint256) paidTurns;
        mapping(address => bool) withdrawnTurns;
        mapping(address => uint8) positions;
        mapping(address => bool) withdrawnInterest;
        uint256 startTimestamp;
        uint256 endTimestamp;
    }

    mapping(string roundId => Round round) public _rounds;

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
    error CollateralAlreadyWithdrawn();
    error InterestAlreadyWithdrawn();

    event RoundInitialized(string indexed roundId, address initializer);
    event PlayerAdded(string indexed roundId, address player);
    event TurnPaid(string indexed roundId, address payer, uint8 turn);
    event TurnWithdrawn(string indexed roundId, address player, uint256 amount);
    event CollateralWithdrawn(string indexed roundId, address player, uint256 amount);
    event InterestWithdrawn(string indexed roundId, address player, uint256 amount);

    function initializeRound(
        string calldata roundId,
        uint256 paymentAmount,
        IERC20 token,
        uint8 numberOfPlayers,
        uint256 frequencyOfTurns,
        uint8 position
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
        round.frequencyOfTurns = frequencyOfTurns;
        round.status = RoundStatus.Pending;
        round.startTimestamp = block.timestamp;

        uint256 amountToLock = paymentAmount * numberOfPlayers;
        token.safeTransferFrom(msg.sender, address(this), amountToLock);

        round.players.push(msg.sender);
        round.positions[msg.sender] = position;
        round.totalAmountLocked += amountToLock;
        round.availableSlots--;

        emit RoundInitialized(roundId, msg.sender);
    }

    function addPlayer(string calldata roundId, uint8 position) external {
        Round storage round = _rounds[roundId];
        if (round.status != RoundStatus.Pending) {
            revert RoundNotPending();
        }
        if (round.availableSlots == 0) {
            revert RoundFull();
        }

        uint256 amountToLock = round.paymentAmount * round.numberOfPlayers;
        round.token.safeTransferFrom(msg.sender, address(this), amountToLock);

        round.players.push(msg.sender);
        round.positions[msg.sender] = position;
        round.totalAmountLocked += amountToLock;
        round.availableSlots--;

        if (round.availableSlots == 0) {
            round.status = RoundStatus.Active;
        }

        emit PlayerAdded(roundId, msg.sender);
    }

    function payTurn(string calldata roundId, uint8 turn) external {
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

        round.turnAccumulations[recipient] += round.paymentAmount;
        round.paidTurns[msg.sender] |= 1 << turn;

        bool allTurnsCompleted = true;
        for (uint8 i = 0; i < round.players.length; i++) {
            if (round.turnAccumulations[round.players[i]] != round.paymentAmount * (round.numberOfPlayers - 1)) {
                allTurnsCompleted = false;
                break;
            }
        }
        if (allTurnsCompleted) {
            round.status = RoundStatus.Completed;
            round.endTimestamp = block.timestamp;
        }

        emit TurnPaid(roundId, msg.sender, turn);
    }

    function withdrawTurn(string calldata roundId) external {
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

        round.token.safeTransfer(msg.sender, expectedAmount);
        round.withdrawnTurns[msg.sender] = true;

        emit TurnWithdrawn(roundId, msg.sender, expectedAmount);
    }

    function withdrawCollateral(string calldata roundId) external {
        Round storage round = _rounds[roundId];
        if (round.status != RoundStatus.Completed) {
            revert RoundNotCompleted();
        }
        if (round.withdrawnCollateral[msg.sender]) {
            revert CollateralAlreadyWithdrawn();
        }

        uint256 withdrawAmount = round.paymentAmount * round.numberOfPlayers;
        round.token.safeTransfer(msg.sender, withdrawAmount);
        round.withdrawnCollateral[msg.sender] = true;

        emit CollateralWithdrawn(roundId, msg.sender, withdrawAmount);
    }

    function withdrawInterest(string calldata roundId) external {
        Round storage round = _rounds[roundId];
        if (round.status != RoundStatus.Completed) {
            revert RoundNotCompleted();
        }
        if (round.withdrawnInterest[msg.sender]) {
            revert InterestAlreadyWithdrawn();
        }

        uint256 position = round.positions[msg.sender];
        uint256 apy = 12; // 12% APY
        uint256 secondsPerDay = 86400;
        uint256 secondsPerYear = secondsPerDay * 365;
        uint256 secondsPlayed = round.endTimestamp - round.startTimestamp;
        uint256 calcInterest = (secondsPlayed * 1e18) / secondsPerYear; // Using fixed point for precision
        uint256 baseInterestOfRound = (round.totalAmountLocked * (apy/2) * calcInterest) / (100 * 1e18);
        uint256 baseInterestOfPlayer = baseInterestOfRound / round.numberOfPlayers;
        uint256 numberOfPositions = (round.numberOfPlayers * (round.numberOfPlayers - 1)) / 2;
        uint256 variableInterestOfPlayer = (baseInterestOfRound * position) / numberOfPositions;
        uint256 interestAmount = baseInterestOfPlayer + variableInterestOfPlayer;

        round.token.safeTransfer(msg.sender, interestAmount);
        round.withdrawnInterest[msg.sender] = true;

        emit InterestWithdrawn(roundId, msg.sender, interestAmount);
    }

    function getRoundInfo(string calldata roundId) external view returns (
        uint256 paymentAmount,
        address tokenAddress,
        uint8 numberOfPlayers,
        uint256 totalAmountLocked,
        uint8 availableSlots,
        uint256 frequencyOfTurns,
        RoundStatus status
    ) {
        Round storage round = _rounds[roundId];
        return (
            round.paymentAmount,
            address(round.token),
            round.numberOfPlayers,
            round.totalAmountLocked,
            round.availableSlots,
            round.frequencyOfTurns,
            round.status
        );
    }
}