// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";

/**
 * @title MockAToken
 * @dev Mock implementation of Aave aToken for testing
 */
contract MockAToken is Test {
    address public UNDERLYING_ASSET_ADDRESS;
    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;
    
    constructor(address underlyingAsset) {
        UNDERLYING_ASSET_ADDRESS = underlyingAsset;
    }
    
    function mint(address to, uint256 amount) public {
        balanceOf[to] += amount;
        totalSupply += amount;
    }
    
    function burn(address from, uint256 amount) public {
        require(balanceOf[from] >= amount, "Insufficient balance");
        balanceOf[from] -= amount;
        totalSupply -= amount;
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
} 