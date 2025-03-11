// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IAave.sol";

/**
 * @title IL2Pool
 * @author Aave
 * @notice Defines the basic interface for an Aave V3 L2 Pool with optimized calldata.
 */
interface IL2Pool {
    /**
     * @notice Supplies an `amount` of underlying asset into the reserve, receiving in return overlying aTokens.
     * - E.g. User supplies 100 USDC and gets in return 100 aUSDC
     * @param args Encoded arguments for supply:
     *   - bits 0-15: uint16 assetId - the index of the asset in the reservesList
     *   - bits 16-143: uint128 amount - cast to 256 bits at decode time
     *   - bits 144-159: uint16 referralCode - used for 3rd party integrations
     */
    function supply(bytes32 args) external;

    /**
     * @notice Withdraws an `amount` of underlying asset from the reserve, burning the equivalent aTokens owned
     * @param args Encoded arguments for withdraw:
     *   - bits 0-15: uint16 assetId - the index of the asset in the reservesList
     *   - bits 16-143: uint128 amount - cast to 256 bits at decode time
     */
    function withdraw(bytes32 args) external returns (uint256);

    /**
     * @notice Returns the normalized income of the reserve
     * @param asset The address of the underlying asset of the reserve
     * @return The reserve's normalized income
     */
    function getReserveNormalizedIncome(address asset) external view returns (uint256);
} 