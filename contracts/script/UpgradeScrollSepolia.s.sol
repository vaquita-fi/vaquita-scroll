// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";
import {VaquitaL2Upgradeable} from "../src/VaquitaL2Upgradeable.sol";
import {VaquitaL2ProxyAdmin} from "../src/VaquitaL2ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract UpgradeScrollSepolia is Script {
    // Existing deployment addresses
    address PROXY = vm.envAddress("L2_PROXY");
    address PROXY_ADMIN = vm.envAddress("L2_PROXY_ADMIN");
    address OWNER = vm.envAddress("L2_OWNER");

    function run() public returns (address implementation) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy new implementation
        VaquitaL2Upgradeable newImplementation = new VaquitaL2Upgradeable();

        // Get proxy admin instance
        VaquitaL2ProxyAdmin admin = VaquitaL2ProxyAdmin(PROXY_ADMIN);

        // Upgrade proxy to new implementation (using empty bytes since we don't want to call any function)
        admin.upgradeAndCall(
            ITransparentUpgradeableProxy(PROXY),
            address(newImplementation),
            ""
        );

        vm.stopBroadcast();

        console.log("New implementation deployed at:", address(newImplementation));
        console.log("Proxy upgraded at:", PROXY);
        console.log("Using proxy admin at:", PROXY_ADMIN);

        return address(newImplementation);
    }
}