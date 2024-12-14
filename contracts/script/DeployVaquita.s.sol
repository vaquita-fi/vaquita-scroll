// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "../src/Vaquita.sol";
import {Script, console} from "forge-std/Script.sol";

contract DeployVaquita is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Vaquita vaquita = new Vaquita();

        console.log("Vaquita deployed to:", address(vaquita));

        vm.stopBroadcast();
    }
}
