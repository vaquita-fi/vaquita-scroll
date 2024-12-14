// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Vaquita.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Simple ERC20 token for testing
contract TestToken is ERC20 {
    constructor() ERC20("Test Token", "TST") {
        _mint(msg.sender, 1000000e18);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract VaquitaTest is Test {
    Vaquita public vaquita;
    TestToken public token;
    address public alice = address(1);
    address public bob = address(2);
    address public charlie = address(3);

    function setUp() public {
        vaquita = new Vaquita();
        token = new TestToken();
        
        token.mint(alice, 1000e18);
        token.mint(bob, 1000e18);
        token.mint(charlie, 1000e18);
        
        vm.prank(alice);
        token.approve(address(vaquita), type(uint256).max);
        vm.prank(bob);
        token.approve(address(vaquita), type(uint256).max);
        vm.prank(charlie);
        token.approve(address(vaquita), type(uint256).max);
    }

    function testInitializeRound() public {
        vm.prank(alice);
        vaquita.initializeRound("round1", 100e18, IERC20(address(token)), 3, 7 days, 1);
        
        // (uint256 paymentAmount, address tokenAddress, uint8 numberOfPlayers, , , , Vaquita.RoundStatus status,,,,) = vaquita.getRoundInfo("round1", 0);
        
        // assertEq(paymentAmount, 100e18);
        // assertEq(tokenAddress, address(token));
        // assertEq(numberOfPlayers, 3);
        // assertEq(uint(status), uint(Vaquita.RoundStatus.Pending));
    }

    function testAddPlayer() public {
        vm.prank(alice);
        vaquita.initializeRound("round1", 100e18, IERC20(address(token)), 3, 7 days, 1);
        
        vm.prank(bob);
        vaquita.addPlayer("round1", 2);
        
        // (, , , , uint8 availableSlots, , , , , ,) = vaquita.getRoundInfo("round1", 0);
        // assertEq(availableSlots, 1);
    }

    function testPayTurn() public {
        vm.prank(alice);
        vaquita.initializeRound("round1", 100e18, IERC20(address(token)), 3, 7 days, 1);
        
        vm.prank(bob);
        vaquita.addPlayer("round1", 2);
        
        vm.prank(charlie);
        vaquita.addPlayer("round1", 3);
        
        vm.prank(bob);
        vaquita.payTurn("round1", 1);
        
        // (, , , , , , Vaquita.RoundStatus status, , , ,) = vaquita.getRoundInfo("round1", 0);
        // assertEq(uint(status), uint(Vaquita.RoundStatus.Active));
    }

    function testWithdrawTurn() public {
        vm.prank(alice);
        vaquita.initializeRound("round1", 100e18, IERC20(address(token)), 3, 7 days, 1);
        
        vm.prank(bob);
        vaquita.addPlayer("round1", 2);
        
        vm.prank(charlie);
        vaquita.addPlayer("round1", 3);
        
        vm.prank(bob);
        vaquita.payTurn("round1", 1);
        
        vm.prank(charlie);
        vaquita.payTurn("round1", 1);
        
        uint256 balanceBefore = token.balanceOf(alice);
        
        vm.prank(alice);
        vaquita.withdrawTurn("round1");
        
        uint256 balanceAfter = token.balanceOf(alice);
        assertEq(balanceAfter - balanceBefore, 200e18);
    }

    function testWithdrawCollateral() public {
        vm.prank(alice);
        vaquita.initializeRound("round1", 100e18, IERC20(address(token)), 3, 7 days, 1);
        
        vm.prank(bob);
        vaquita.addPlayer("round1", 2);
        
        vm.prank(charlie);
        vaquita.addPlayer("round1", 3);
        
        vm.prank(bob);
        vaquita.payTurn("round1", 1);
        
        vm.prank(charlie);
        vaquita.payTurn("round1", 1);
        
        vm.prank(alice);
        vaquita.payTurn("round1", 2);
        
        vm.prank(charlie);
        vaquita.payTurn("round1", 2);
        
        vm.prank(alice);
        vaquita.payTurn("round1", 3);
        
        vm.prank(bob);
        vaquita.payTurn("round1", 3);
        
        uint256 balanceBefore = token.balanceOf(alice);
        
        vm.prank(alice);
        vaquita.withdrawCollateral("round1");
        
        uint256 balanceAfter = token.balanceOf(alice);
        assertEq(balanceAfter - balanceBefore, 300e18);
    }

    function testCannotPayOwnTurn() public {
        vm.prank(alice);
        vaquita.initializeRound("round1", 100e18, IERC20(address(token)), 3, 7 days, 1);
        
        vm.prank(bob);
        vaquita.addPlayer("round1", 2);
        
        vm.prank(charlie);
        vaquita.addPlayer("round1", 3);
        
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSignature("CannotPayOwnTurn()"));
        vaquita.payTurn("round1", 1);
    }

    function testCannotWithdrawBeforeCompleted() public {
        vm.prank(alice);
        vaquita.initializeRound("round1", 100e18, IERC20(address(token)), 3, 7 days, 1);
        
        vm.prank(bob);
        vaquita.addPlayer("round1", 2);
        
        vm.prank(charlie);
        vaquita.addPlayer("round1", 3);
        
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSignature("RoundNotCompleted()"));
        vaquita.withdrawCollateral("round1");
    }
}