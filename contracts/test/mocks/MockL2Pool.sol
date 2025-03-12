// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";

/**
 * @title MockL2Pool
 * @dev Mock implementation of Aave L2Pool for testing
 */
contract MockL2Pool is Test {
    event Supply(
        address indexed asset,
        address indexed onBehalfOf,
        address indexed caller,
        uint256 amount,
        uint16 referralCode
    );

    event Withdraw(
        address indexed asset,
        address indexed to,
        uint256 amount
    );
    
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external {
        emit Supply(asset, onBehalfOf, msg.sender, amount, referralCode);
    }
    
    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256) {
        emit Withdraw(asset, to, amount);
        return amount;
    }

    function getReserveNormalizedIncome(address) external pure returns (uint256) {
        return 1e27; // Initial RAY value
    }
} 