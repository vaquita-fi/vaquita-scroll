// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import "../../src/interfaces/IL2Encoder.sol";

/**
 * @title MockL2Encoder
 * @dev Mock implementation of Aave L2Encoder for testing
 */
contract MockL2Encoder is IL2Encoder, Test {
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
    ) external pure override returns (bytes32) {
        return bytes32(
            (uint256(referralCode) << 144) |
            (uint256(uint128(amount)) << 16) |
            uint256(reserveId)
        );
    }
    
    /**
     * @notice Encodes the withdraw parameters
     * @param reserveId The reserve ID
     * @param amount The amount to withdraw
     * @return The encoded parameters
     */
    function encodeWithdrawParams(
        uint16 reserveId,
        uint256 amount
    ) external pure override returns (bytes32) {
        return bytes32(
            (uint256(uint128(amount)) << 16) |
            uint256(reserveId)
        );
    }
}
