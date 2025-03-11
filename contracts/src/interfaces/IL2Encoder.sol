// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IL2Encoder
 * @author Aave
 * @notice Defines the interface for the L2 Encoder helper contract
 */
interface IL2Encoder {
    /**
     * @notice Encodes supply parameters into bytes32
     * @param reserveId The id of the reserve in Aave
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
     * @notice Encodes withdraw parameters into bytes32
     * @param reserveId The id of the reserve in Aave
     * @param amount The amount to withdraw
     * @return The encoded parameters
     */
    function encodeWithdrawParams(
        uint16 reserveId,
        uint256 amount
    ) external pure returns (bytes32);
} 