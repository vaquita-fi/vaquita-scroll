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

contract VaquitaL2UpgradeableTest is Test {
    VaquitaL2Upgradeable public vaquitaL2Implementation;
    VaquitaL2Proxy public vaquitaL2Proxy;
    VaquitaL2ProxyAdmin public proxyAdmin;
    VaquitaL2Upgradeable public vaquitaL2;
    
    MockERC20 public token;
    MockAToken public aToken;
    MockL2Pool public aavePool;
    
    address public owner = address(1);
    address public player1 = address(2);
    address public player2 = address(3);
    address public player3 = address(4);
    address public player4 = address(5);
    address public player5 = address(6);
    address public player6 = address(7);
    address public player7 = address(8);
    address public player8 = address(9);
    address public player9 = address(10);
    address public player10 = address(11);
    
    uint256 public constant PAYMENT_AMOUNT = 100 ether;
    uint256 public constant ROUND_ID = 1;
    uint256 public constant NUM_PLAYERS = 3;
    uint256 public constant FREQUENCY = 7 days;
    
    function setUp() public {
        // Deploy mock contracts
        token = new MockERC20("Test Token", "TEST", 18);
        aavePool = new MockL2Pool();
        aToken = new MockAToken(address(token));
        
        // Setup accounts
        vm.startPrank(owner);
        token.mint(player1, 1000 ether);
        token.mint(player2, 1000 ether);
        token.mint(player3, 1000 ether);
        token.mint(player4, 1000 ether);
        token.mint(player5, 1000 ether);
        token.mint(player6, 1000 ether);
        token.mint(player7, 1000 ether);
        token.mint(player8, 1000 ether);
        token.mint(player9, 1000 ether);
        token.mint(player10, 1000 ether);
        vm.stopPrank();
        
        // Deploy implementation
        vaquitaL2Implementation = new VaquitaL2Upgradeable();
        
        // Deploy proxy admin
        proxyAdmin = new VaquitaL2ProxyAdmin(owner);
        
        // Deploy proxy with initialization data
        vm.startPrank(owner);
        bytes memory initData = abi.encodeWithSelector(
            VaquitaL2Upgradeable.initialize.selector,
            address(aavePool)
        );
        
        vaquitaL2Proxy = new VaquitaL2Proxy(
            address(vaquitaL2Implementation),
            address(proxyAdmin),
            initData
        );
        
        // Create interface to proxy
        vaquitaL2 = VaquitaL2Upgradeable(address(vaquitaL2Proxy));
        
        // Register aToken
        vaquitaL2.registerAToken(address(token), address(aToken));
        vm.stopPrank();
    }
    
    function testInitialization() public view {
        assertEq(vaquitaL2.getL2Pool(), address(aavePool));
        assertEq(vaquitaL2.aTokens(address(token)), address(aToken));
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

    function testTenPlayerPositions() public {
        uint256 tenPlayerRoundId = 2;
        uint256 numPlayers = 10;
        
        // Set initial block time and prevrandao
        vm.warp(1000000); // Start with a known timestamp
        vm.prevrandao(bytes32(uint256(0))); // Start with prevrandao 0
        
        // Initialize round with player1
        vm.startPrank(player1);
        token.approve(address(vaquitaL2), type(uint256).max);
        vaquitaL2.initializeRound(
            tenPlayerRoundId,
            PAYMENT_AMOUNT,
            IERC20(address(token)),
            numPlayers,
            FREQUENCY
        );
        vm.stopPrank();
        
        // Track all positions to verify uniqueness
        uint256[] memory usedPositions = new uint256[](10);
        usedPositions[0] = vaquitaL2.getPlayerPosition(tenPlayerRoundId, player1);
        
        // Add remaining 9 players
        address[9] memory remainingPlayers = [
            player2, player3, player4, player5,
            player6, player7, player8, player9, player10
        ];
        
        for (uint i = 0; i < remainingPlayers.length; i++) {
            // Advance block time and prevrandao to get different random values
            vm.warp(block.timestamp + 1 hours);
            vm.prevrandao(bytes32(uint256(i + 1)));
            
            // Add player
            vm.startPrank(remainingPlayers[i]);
            token.approve(address(vaquitaL2), type(uint256).max);
            vaquitaL2.addPlayer(tenPlayerRoundId);
            vm.stopPrank();
            
            // Get and verify their position
            uint256 position = vaquitaL2.getPlayerPosition(tenPlayerRoundId, remainingPlayers[i]);
            
            // Verify position is within bounds
            assertTrue(position < numPlayers, "Position exceeds number of players");
            
            // Verify position is unique
            for (uint j = 0; j < i + 1; j++) {
                assertNotEq(position, usedPositions[j], "Duplicate position found");
            }
            
            // Store position
            usedPositions[i + 1] = position;
        }
        
        // Verify round status
        (,,,, uint availableSlots,, VaquitaL2Upgradeable.RoundStatus status) = vaquitaL2.getRoundInfo(tenPlayerRoundId);
        assertEq(availableSlots, 0, "All slots should be filled");
        assertEq(uint(status), uint(VaquitaL2Upgradeable.RoundStatus.Active), "Round should be active");
        
        // Verify all positions 0-9 are used exactly once
        bool[] memory positionUsed = new bool[](10);
        for (uint i = 0; i < 10; i++) {
            assertTrue(!positionUsed[usedPositions[i]], "Position used multiple times");
            positionUsed[usedPositions[i]] = true;
        }
        for (uint i = 0; i < 10; i++) {
            assertTrue(positionUsed[i], "Position never used");
        }
    }
    
    // function testUpgrade() public {
    //     // Deploy new implementation
    //     VaquitaL2Upgradeable newImplementation = new VaquitaL2Upgradeable();
        
    //     // Upgrade proxy
    //     vm.prank(owner);
    //     proxyAdmin.upgradeAndCall(ITransparentUpgradeableProxy(address(vaquitaL2Proxy)), address(newImplementation), "");
        
    //     // Verify functionality still works after upgrade
    //     // Note: In OpenZeppelin v5, ProxyAdmin no longer has getProxyImplementation function
        
    //     // Verify functionality still works
    //     assertEq(vaquitaL2.getL2Pool(), address(aavePool));
    // }
}

// End of test contract 