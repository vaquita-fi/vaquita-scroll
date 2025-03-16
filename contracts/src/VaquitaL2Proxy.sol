// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin-contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

/**
 * @title VaquitaL2Proxy
 * @dev Simple transparent proxy for VaquitaL2
 */
contract VaquitaL2Proxy is TransparentUpgradeableProxy {
    constructor(
        address _logic,
        address _admin,
        bytes memory _data
    ) TransparentUpgradeableProxy(_logic, _admin, _data) {}
} 