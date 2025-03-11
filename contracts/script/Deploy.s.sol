// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/VaquitaL1.sol";

contract Deploy is Script {
    // Aave v3 Pool address
    address AAVE_POOL = vm.envAddress("AAVE_POOL");
    
    // USDC token address
    address USDC_TOKEN = vm.envAddress("USDC_TOKEN");
    
    // aUSDC token address (Aave V3)
    address AUSDC_TOKEN = vm.envAddress("AUSDC_TOKEN");

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy VaquitaL1 with Aave V3 Pool address
        VaquitaL1 vaquita = new VaquitaL1(AAVE_POOL);
        
        // Register USDC token with its corresponding aToken
        vaquita.registerAToken(USDC_TOKEN, AUSDC_TOKEN);
        
        vm.stopBroadcast();
        
        console.log("VaquitaL1 deployed at:", address(vaquita));
        console.log("Using Pool at:", AAVE_POOL);
        console.log("Using USDC at:", USDC_TOKEN);
        console.log("Using aUSDC at:", AUSDC_TOKEN);
    }
} 