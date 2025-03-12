// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

/**
 * @title VaquitaL2ProxyAdmin
 * @dev Simple proxy admin for VaquitaL2Proxy
 */
contract VaquitaL2ProxyAdmin is ProxyAdmin {
    constructor(address initialOwner) ProxyAdmin(initialOwner) {}
} 