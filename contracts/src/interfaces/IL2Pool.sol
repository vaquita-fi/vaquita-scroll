// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./IAave.sol";

/**
 * @title IL2Pool
 * @dev Interface for the Aave L2Pool contract
 */
interface IL2Pool {
    /**
     * @notice Supplies an `amount` of underlying asset into the reserve, receiving in return overlying aTokens.
     * - E.g. User supplies 100 USDC and gets in return 100 aUSDC
     * @param args The encoded parameters
     */
    function supply(bytes32 args) external;

    /**
     * @notice Withdraws an `amount` of underlying asset from the reserve, burning the equivalent aTokens owned
     * - E.g. User has 100 aUSDC, calls withdraw and receives 100 USDC, burning the 100 aUSDC
     * @param args The encoded parameters
     */
    function withdraw(bytes32 args) external;

    /**
     * @notice Returns the normalized income of the reserve
     * @param asset The address of the underlying asset of the reserve
     * @return The reserve's normalized income
     */
    function getReserveNormalizedIncome(address asset) external view returns (uint256);
} 