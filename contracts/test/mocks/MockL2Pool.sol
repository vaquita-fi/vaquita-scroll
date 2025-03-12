// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";

/**
 * @title MockL2Pool
 * @dev Mock implementation of Aave L2Pool for testing
 */
contract MockL2Pool is Test {
    event Supply(bytes32 args);
    event Withdraw(bytes32 args);
    
    function supply(bytes32 args) external {
        emit Supply(args);
    }
    
    function withdraw(bytes32 args) external {
        emit Withdraw(args);
    }
} 