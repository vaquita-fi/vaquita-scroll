// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Vaquita.sol";

contract DeployVaquitaSepolia is Script {
    // Sepolia Aave v3 Pool address
    address AAVE_POOL_SEPOLIA = 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951;
    
    // Sepolia USDC token address
    address USDC_TOKEN_SEPOLIA = 0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8;
    
    // Sepolia aUSDC token address (Aave V3)
    address AUSDC_TOKEN_SEPOLIA = 0x16da4541AD1807f4443d92d26044C1147406eb8F;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy Vaquita with Aave V3 Pool address
        Vaquita vaquita = new Vaquita(AAVE_POOL_SEPOLIA);
        
        // Register USDC token with its corresponding aToken
        vaquita.registerAToken(USDC_TOKEN_SEPOLIA, AUSDC_TOKEN_SEPOLIA);
        
        vm.stopBroadcast();
        
        console.log("Vaquita deployed at:", address(vaquita));
    }
}
