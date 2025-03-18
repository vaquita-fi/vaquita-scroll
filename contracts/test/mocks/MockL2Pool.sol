// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import {MockAToken} from "./MockAToken.sol";
import {IERC20} from "@openzeppelin-contracts/token/ERC20/IERC20.sol";

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
    
    mapping(address => MockAToken) public aTokens;

    constructor() {
        aTokens[0x2C9678042D52B97D27f2bD2947F7111d93F3dD0D] = MockAToken(0x6E4A1BcBd3C3038e6957207cadC1A17092DC7ba3);
    }
    
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
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