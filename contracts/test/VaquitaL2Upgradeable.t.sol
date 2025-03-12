// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {VaquitaL2Upgradeable} from "../src/VaquitaL2Upgradeable.sol";
import {VaquitaL2Proxy} from "../src/VaquitaL2Proxy.sol";
import {VaquitaL2ProxyAdmin} from "../src/VaquitaL2ProxyAdmin.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {MockAToken} from "./mocks/MockAToken.sol";
import {MockL2Pool} from "./mocks/MockL2Pool.sol";
import {MockL2Encoder} from "./mocks/MockL2Encoder.sol";

contract VaquitaL2UpgradeableTest is Test {
    VaquitaL2Upgradeable public vaquitaL2Implementation;
    VaquitaL2Proxy public vaquitaL2Proxy;
    VaquitaL2ProxyAdmin public proxyAdmin;
    VaquitaL2Upgradeable public vaquitaL2;
    
    MockERC20 public token;
    MockAToken public aToken;
    MockL2Pool public aavePool;
    MockL2Encoder public l2Encoder;
    
    address public owner = address(1);
    address public player1 = address(2);
    address public player2 = address(3);
    address public player3 = address(4);
    
    uint256 public constant PAYMENT_AMOUNT = 100 ether;
    uint256 public constant ROUND_ID = 1;
    uint256 public constant NUM_PLAYERS = 3;
    uint256 public constant FREQUENCY = 7 days;
    uint16 public constant RESERVE_ID = 1;
    
    function setUp() public {
        // Deploy mock contracts
        token = new MockERC20("Test Token", "TEST", 18);
        aavePool = new MockL2Pool();
        l2Encoder = new MockL2Encoder();
        aToken = new MockAToken(address(token));
        
        // Setup accounts
        vm.startPrank(owner);
        token.mint(player1, 1000 ether);
        token.mint(player2, 1000 ether);
        token.mint(player3, 1000 ether);
        vm.stopPrank();
        
        // Deploy implementation
        vaquitaL2Implementation = new VaquitaL2Upgradeable();
        
        // Deploy proxy admin
        proxyAdmin = new VaquitaL2ProxyAdmin(owner);
        
        // Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            VaquitaL2Upgradeable.initialize.selector,
            address(aavePool),
            address(l2Encoder)
        );
        
        // Deploy proxy
        vaquitaL2Proxy = new VaquitaL2Proxy(
            address(vaquitaL2Implementation),
            address(proxyAdmin),
            initData
        );
        
        // Create interface to proxy
        vaquitaL2 = VaquitaL2Upgradeable(address(vaquitaL2Proxy));
        
        // Register aToken
        vm.prank(owner);
        vaquitaL2.registerAToken(address(token), address(aToken), RESERVE_ID);
    }
    
    function testInitialization() public view {
        assertEq(vaquitaL2.getL2Pool(), address(aavePool));
        assertEq(vaquitaL2.tokenToAToken(address(token)), address(aToken));
        assertEq(vaquitaL2.tokenToReserveId(address(token)), RESERVE_ID);
    }
    
    function testInitializeRound() public {
        // Setup
        vm.startPrank(player1);
        token.approve(address(vaquitaL2), type(uint256).max);
        
        // Initialize round
        vaquitaL2.initializeRound(
            ROUND_ID,
            PAYMENT_AMOUNT,
            IERC20(address(token)),
            NUM_PLAYERS,
            FREQUENCY
        );
        vm.stopPrank();
        
        // Check round info
        (
            uint paymentAmount,
            address tokenAddress,
            uint numberOfPlayers,
            uint totalAmountLocked,
            uint availableSlots,
            uint frequencyOfPayments,
            VaquitaL2Upgradeable.RoundStatus status
        ) = vaquitaL2.getRoundInfo(ROUND_ID);
        
        assertEq(paymentAmount, PAYMENT_AMOUNT);
        assertEq(tokenAddress, address(token));
        assertEq(numberOfPlayers, NUM_PLAYERS);
        assertEq(totalAmountLocked, PAYMENT_AMOUNT * (NUM_PLAYERS - 1));
        assertEq(availableSlots, NUM_PLAYERS - 1);
        assertEq(frequencyOfPayments, FREQUENCY);
        assertEq(uint(status), uint(VaquitaL2Upgradeable.RoundStatus.Pending));
    }
    
    function testAddPlayer() public {
        // Initialize round
        vm.startPrank(player1);
        token.approve(address(vaquitaL2), type(uint256).max);
        vaquitaL2.initializeRound(
            ROUND_ID,
            PAYMENT_AMOUNT,
            IERC20(address(token)),
            NUM_PLAYERS,
            FREQUENCY
        );
        vm.stopPrank();
        
        // Add player2
        vm.startPrank(player2);
        token.approve(address(vaquitaL2), type(uint256).max);
        vaquitaL2.addPlayer(ROUND_ID);
        vm.stopPrank();
        
        // Check round info
        (
            ,
            ,
            ,
            ,
            uint availableSlots,
            ,
            VaquitaL2Upgradeable.RoundStatus status
        ) = vaquitaL2.getRoundInfo(ROUND_ID);
        
        assertEq(availableSlots, NUM_PLAYERS - 2);
        assertEq(uint(status), uint(VaquitaL2Upgradeable.RoundStatus.Pending));
        
        // Add player3
        vm.startPrank(player3);
        token.approve(address(vaquitaL2), type(uint256).max);
        vaquitaL2.addPlayer(ROUND_ID);
        vm.stopPrank();
        
        // Check round info after all players joined
        (
            ,
            ,
            ,
            ,
            availableSlots,
            ,
            status
        ) = vaquitaL2.getRoundInfo(ROUND_ID);
        
        assertEq(availableSlots, 0);
        assertEq(uint(status), uint(VaquitaL2Upgradeable.RoundStatus.Active));
    }
    
    function testUpgrade() public {
        // Deploy new implementation
        VaquitaL2Upgradeable newImplementation = new VaquitaL2Upgradeable();
        
        // Upgrade proxy
        vm.prank(owner);
        proxyAdmin.upgradeAndCall(ITransparentUpgradeableProxy(address(vaquitaL2Proxy)), address(newImplementation), "");
        
        // Verify functionality still works after upgrade
        // Note: In OpenZeppelin v5, ProxyAdmin no longer has getProxyImplementation function
        
        // Verify functionality still works
        assertEq(vaquitaL2.getL2Pool(), address(aavePool));
    }
}

// End of test contract 