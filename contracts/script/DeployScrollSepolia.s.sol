// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/VaquitaL2.sol";

contract DeployScrollSepolia is Script {
    // Scroll Sepolia Aave v3 L2Pool address
    address AAVE_L2POOL_SCROLL_SEPOLIA = 0x48914C788295b5db23aF2b5F0B3BE775C4eA9440;
    
    // Scroll Sepolia Aave v3 L2Encoder address
    address AAVE_L2ENCODER_SCROLL_SEPOLIA = 0x3Bb33c67908D0d58F8d7349cBe726ff3b059e0fC;
    
    // Scroll Sepolia USDC token address
    address USDC_TOKEN_SCROLL_SEPOLIA = 0x2C9678042D52B97D27f2bD2947F7111d93F3dD0D;
    
    // Scroll Sepolia aUSDC token address (Aave V3)
    address AUSDC_TOKEN_SCROLL_SEPOLIA = 0x6E4A1BcBd3C3038e6957207cadC1A17092DC7ba3;
    
    // Scroll Sepolia USDC reserve ID
    uint16 USDC_RESERVE_ID_SCROLL_SEPOLIA = 2;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy VaquitaL2 with Aave V3 L2Pool and L2Encoder addresses
        VaquitaL2 vaquita = new VaquitaL2(
            AAVE_L2POOL_SCROLL_SEPOLIA, 
            AAVE_L2ENCODER_SCROLL_SEPOLIA
        );
        
        // Register USDC token with its corresponding aToken and reserve ID
        vaquita.registerAToken(
            USDC_TOKEN_SCROLL_SEPOLIA, 
            AUSDC_TOKEN_SCROLL_SEPOLIA, 
            USDC_RESERVE_ID_SCROLL_SEPOLIA
        );
        
        vm.stopBroadcast();
        
        console.log("VaquitaL2 deployed at:", address(vaquita));
        console.log("Using L2Pool at:", AAVE_L2POOL_SCROLL_SEPOLIA);
        console.log("Using L2Encoder at:", AAVE_L2ENCODER_SCROLL_SEPOLIA);
        console.log("Using USDC at:", USDC_TOKEN_SCROLL_SEPOLIA);
        console.log("Using aUSDC at:", AUSDC_TOKEN_SCROLL_SEPOLIA);
        console.log("Using USDC Reserve ID:", USDC_RESERVE_ID_SCROLL_SEPOLIA);
    }
} 