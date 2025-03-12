// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./IAave.sol";

/**
 * @title IL2Pool
 * @dev Interface for the Aave L2Pool contract
 */
interface IL2Pool {
    /**
     * @notice Emitted on supply
     * @param asset The address of the underlying asset
     * @param onBehalfOf The beneficiary of the supply
     * @param caller The caller of the supply function
     * @param amount The amount supplied
     * @param referralCode The referral code used
     */
    event Supply(
        address indexed asset,
        address indexed onBehalfOf,
        address indexed caller,
        uint256 amount,
        uint16 referralCode
    );

    /**
     * @notice Supplies an `amount` of underlying asset into the reserve, receiving in return overlying aTokens.
     * - E.g. User supplies 100 USDC and gets in return 100 aUSDC
     * @param asset The address of the underlying asset to supply
     * @param amount The amount to be supplied
     * @param onBehalfOf The address that will receive the aTokens
     * @param referralCode Code used to register the integrator originating the operation
     */
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    /**
     * @notice Withdraws an `amount` of underlying asset from the reserve, burning the equivalent aTokens owned
     * - E.g. User has 100 aUSDC, calls withdraw and receives 100 USDC, burning the 100 aUSDC
     * @param asset The address of the underlying asset to withdraw
     * @param amount The underlying amount to be withdrawn
     * @param to The address that will receive the underlying
     * @return The final amount withdrawn
     */
    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);

    /**
     * @notice Returns the normalized income of the reserve
     * @param asset The address of the underlying asset of the reserve
     * @return The reserve's normalized income
     */
    function getReserveNormalizedIncome(address asset) external view returns (uint256);
} 