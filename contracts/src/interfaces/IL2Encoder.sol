// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

/**
 * @title IL2Encoder
 * @dev Interface for the Aave L2Encoder contract
 */
interface IL2Encoder {
    /**
     * @notice Encodes the supply parameters
     * @param reserveId The reserve ID
     * @param amount The amount to supply
     * @param referralCode The referral code
     * @return The encoded parameters
     */
    function encodeSupplyParams(
        uint16 reserveId,
        uint256 amount,
        uint16 referralCode
    ) external pure returns (bytes32);

    /**
     * @notice Encodes the withdraw parameters
     * @param reserveId The reserve ID
     * @param amount The amount to withdraw
     * @return The encoded parameters
     */
    function encodeWithdrawParams(
        uint16 reserveId,
        uint256 amount
    ) external pure returns (bytes32);
} 