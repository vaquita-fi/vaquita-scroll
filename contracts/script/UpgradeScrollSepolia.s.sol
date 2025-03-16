// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";
import {VaquitaL2Upgradeable} from "../src/VaquitaL2Upgradeable.sol";
import {VaquitaL2ProxyAdmin} from "../src/VaquitaL2ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract UpgradeScrollSepolia is Script {
    // Existing deployment addresses
    address constant PROXY = 0x97b6d74cEc11A1a86AF8655b59e075b12144e280;
    address constant PROXY_ADMIN = 0x6A4e6Aa186A64B03D204A82b33927D0dfc5d525f;

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