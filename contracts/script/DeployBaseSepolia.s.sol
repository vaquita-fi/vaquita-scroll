// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";
import {VaquitaL2Upgradeable} from "../src/VaquitaL2Upgradeable.sol";
import {VaquitaL2Proxy} from "../src/VaquitaL2Proxy.sol";
import {VaquitaL2ProxyAdmin} from "../src/VaquitaL2ProxyAdmin.sol";

/**
 * @title DeployBaseSepolia
 * @dev Script to deploy VaquitaL2Upgradeable with proxy and proxy admin
 */
contract DeployBaseSepolia is Script {
    // Base Sepolia Aave v3 L2Pool address
    address constant AAVE_L2POOL_BASE_SEPOLIA = 0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b;
    
    // Base Sepolia USDC token address
    address constant USDC_TOKEN_BASE_SEPOLIA = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    
    // Base Sepolia aUSDC token address (Aave V3)
    address constant AUSDC_TOKEN_BASE_SEPOLIA = 0xf53B60F4006cab2b3C4688ce41fD5362427A2A66;
    

    function run() public returns (address proxy, address implementation, address proxyAdmin) {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcast for deployment
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy implementation
        VaquitaL2Upgradeable vaquitaL2Implementation = new VaquitaL2Upgradeable();
        
        // Deploy proxy admin
        VaquitaL2ProxyAdmin admin = new VaquitaL2ProxyAdmin(msg.sender);
        
        // Get initialization data
        bytes memory initData = abi.encodeWithSelector(
            VaquitaL2Upgradeable.initialize.selector,
            AAVE_L2POOL_BASE_SEPOLIA
        );
        
        // Deploy proxy
        VaquitaL2Proxy vaquitaL2Proxy = new VaquitaL2Proxy(
            address(vaquitaL2Implementation),
            address(admin),
            initData
        );
        
        // Get the proxy as VaquitaL2Upgradeable for interaction
        VaquitaL2Upgradeable vaquitaL2 = VaquitaL2Upgradeable(address(vaquitaL2Proxy));
        
        // Register USDC token with its corresponding aToken and reserve ID
        vaquitaL2.registerAToken(
            USDC_TOKEN_BASE_SEPOLIA, 
            AUSDC_TOKEN_BASE_SEPOLIA
        );
        
        // End broadcast
        vm.stopBroadcast();
        
        // Log deployed addresses
        console.log("VaquitaL2Upgradeable implementation deployed at:", address(vaquitaL2Implementation));
        console.log("VaquitaL2ProxyAdmin deployed at:", address(admin));
        console.log("VaquitaL2Proxy deployed at:", address(vaquitaL2Proxy));
        console.log("Using L2Pool at:", AAVE_L2POOL_BASE_SEPOLIA);
        console.log("Using USDC at:", USDC_TOKEN_BASE_SEPOLIA);
        console.log("Using aUSDC at:", AUSDC_TOKEN_BASE_SEPOLIA);
        
        return (address(vaquitaL2Proxy), address(vaquitaL2Implementation), address(admin));
    }
}