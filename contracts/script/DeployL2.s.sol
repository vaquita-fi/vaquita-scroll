// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/VaquitaL2.sol";

contract DeployL2 is Script {
    function run() public {
        // Load private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Load L2 addresses from environment
        address AAVE_L2POOL = vm.envAddress("L2_AAVE_POOL");
        address AAVE_L2ENCODER = vm.envAddress("L2_AAVE_ENCODER");
        address USDC_TOKEN = vm.envAddress("L2_USDC_TOKEN");
        address AUSDC_TOKEN = vm.envAddress("L2_AUSDC_TOKEN");
        uint16 USDC_RESERVE_ID = uint16(vm.envUint("L2_USDC_RESERVE_ID"));
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy VaquitaL2 with Aave V3 L2Pool and L2Encoder addresses
        VaquitaL2 vaquita = new VaquitaL2(AAVE_L2POOL, AAVE_L2ENCODER);
        
        // Register USDC token with its corresponding aToken and reserve ID
        vaquita.registerAToken(USDC_TOKEN, AUSDC_TOKEN, USDC_RESERVE_ID);
        
        vm.stopBroadcast();
        
        console.log("VaquitaL2 deployed at:", address(vaquita));
        console.log("Using L2Pool at:", AAVE_L2POOL);
        console.log("Using L2Encoder at:", AAVE_L2ENCODER);
        console.log("Using USDC at:", USDC_TOKEN);
        console.log("Using aUSDC at:", AUSDC_TOKEN);
        console.log("Using USDC Reserve ID:", USDC_RESERVE_ID);
    }
} 