// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/VaquitaL2.sol";
import "../src/interfaces/IL2Pool.sol";
import "../src/interfaces/IL2Encoder.sol";
import "../src/interfaces/IAave.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock L2Pool for testing
contract MockL2Pool is IL2Pool {
    mapping(address => uint) public deposits;
    mapping(address => mapping(address => uint)) public userDeposits;
    
    // Mock implementation for testing
    function supply(bytes32 args) external override {
        // Extract parameters from args
        uint16 assetId = uint16(uint256(args));
        uint256 amount = uint256(uint128(uint256(args) >> 16));
        
        // For testing, we'll use a simple mapping of assetId to token address
        address asset = getAssetFromId(assetId);
        
        deposits[asset] += amount;
        userDeposits[asset][msg.sender] += amount;
        
        // Transfer tokens from sender to this contract
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        
        // Mint aTokens to the sender
        MockAToken aToken = MockAToken(getATokenFromAsset(asset));
        if (address(aToken) != address(0)) {
            aToken.mint(msg.sender, amount);
        }
    }
    
    function withdraw(bytes32 args) external override returns (uint256) {
        // Extract parameters from args
        uint16 assetId = uint16(uint256(args));
        uint256 amount = uint256(uint128(uint256(args) >> 16));
        
        // For testing, we'll use a simple mapping of assetId to token address
        address asset = getAssetFromId(assetId);
        
        require(userDeposits[asset][msg.sender] >= amount, "Insufficient balance");
        
        deposits[asset] -= amount;
        userDeposits[asset][msg.sender] -= amount;
        
        // Burn aTokens from the sender
        MockAToken aToken = MockAToken(getATokenFromAsset(asset));
        if (address(aToken) != address(0)) {
            aToken.burn(msg.sender, amount);
        }
        
        // Transfer tokens from this contract to recipient
        IERC20(asset).transfer(msg.sender, amount);
        
        return amount;
    }
    
    function getReserveNormalizedIncome(address) external pure override returns (uint) {
        return 1e27; // Default normalized income
    }
    
    // Helper function to simulate interest accrual
    function addInterest(address asset, uint interestAmount) external {
        deposits[asset] += interestAmount;
        
        // Mint additional aTokens to simulate interest
        MockAToken aToken = MockAToken(getATokenFromAsset(asset));
        if (address(aToken) != address(0)) {
            aToken.mint(address(this), interestAmount);
        }
    }
    
    // Helper function to map assetId to token address
    function getAssetFromId(uint16 assetId) internal pure returns (address) {
        // For the USDC reserve ID, return the actual token address
        if (assetId == 2) { // USDC_RESERVE_ID
            return address(0x5615dEB798BB3E4dFa0139dFa1b3D433Cc23b72f); // TestUSDC address
        }
        // For other IDs, use a deterministic address
        return address(uint160(assetId));
    }
    
    // Helper function to store aToken addresses
    mapping(address => address) public assetToAToken;
    
    function setAToken(address asset, address aToken) external {
        assetToAToken[asset] = aToken;
    }
    
    function getATokenFromAsset(address asset) internal view returns (address) {
        return assetToAToken[asset];
    }
}

// Mock L2Encoder for testing
contract MockL2Encoder is IL2Encoder {
    function encodeSupplyParams(
        uint16 reserveId,
        uint256 amount,
        uint16 referralCode
    ) external pure override returns (bytes32) {
        return bytes32(
            (uint256(referralCode) << 144) |
            (uint256(uint128(amount)) << 16) |
            uint256(reserveId)
        );
    }
    
    function encodeWithdrawParams(
        uint16 reserveId,
        uint256 amount
    ) external pure override returns (bytes32) {
        return bytes32(
            (uint256(uint128(amount)) << 16) |
            uint256(reserveId)
        );
    }
}

// Mock aToken for testing
contract MockAToken is IAToken, ERC20 {
    address private immutable _underlyingAsset;
    
    constructor(address underlyingAsset) ERC20("aToken", "aTKN") {
        _underlyingAsset = underlyingAsset;
    }
    
    function UNDERLYING_ASSET_ADDRESS() external view override returns (address) {
        return _underlyingAsset;
    }
    
    function scaledBalanceOf(address user) external view override returns (uint) {
        return balanceOf(user);
    }
    
    // Explicitly override balanceOf to resolve the conflict
    function balanceOf(address user) public view override(IAToken, ERC20) returns (uint) {
        return super.balanceOf(user);
    }
    
    // Helper function for testing
    function mint(address to, uint amount) external {
        _mint(to, amount);
    }
    
    // Helper function for testing
    function burn(address from, uint amount) external {
        _burn(from, amount);
    }
}

// Simple ERC20 token for testing (USDC)
contract TestUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1000000 * 10**6);
    }
    
    function decimals() public pure override returns (uint8) {
        return 6; // USDC has 6 decimals
    }

    function mint(address to, uint amount) public {
        _mint(to, amount);
    }
}

// Test contract to expose internal functions for testing
contract VaquitaL2TestHelper is VaquitaL2 {
    constructor(address _aavePool, address _l2Encoder) VaquitaL2(_aavePool, _l2Encoder) {}
    
    // Expose the internal _getRandomPosition function for testing
    function getRandomPosition(uint numberOfPlayers, uint roundId) public view returns (uint) {
        return _getRandomPosition(numberOfPlayers, roundId);
    }
}

contract VaquitaL2Test is Test {
    VaquitaL2 public vaquita;
    TestUSDC public token;
    MockL2Pool public l2Pool;
    MockL2Encoder public l2Encoder;
    MockAToken public aToken;
    
    address public alice = address(1);
    address public bob = address(2);
    address public charlie = address(3);
    
    uint public roundId = 1;
    uint public paymentAmount = 100 * 10**6; // 100 USDC
    uint public numberOfPlayers = 3;
    uint public frequencyOfPayments = 7 days;
    uint16 public constant USDC_RESERVE_ID = 2;

    function setUp() public {
        // Deploy mock contracts
        token = new TestUSDC();
        l2Pool = new MockL2Pool();
        l2Encoder = new MockL2Encoder();
        aToken = new MockAToken(address(token));
        
        // Set up the aToken in the mock pool
        l2Pool.setAToken(address(uint160(USDC_RESERVE_ID)), address(aToken));
        
        // Deploy VaquitaL2 with mock L2Pool and L2Encoder
        vaquita = new VaquitaL2(address(l2Pool), address(l2Encoder));
        
        // Register the token with its aToken and reserve ID
        vaquita.registerAToken(address(token), address(aToken), USDC_RESERVE_ID);
        
        // Mint tokens to players
        token.mint(alice, 10000 * 10**6); // 10,000 USDC
        token.mint(bob, 10000 * 10**6);
        token.mint(charlie, 10000 * 10**6);
        
        // Set up player accounts
        vm.prank(alice);
        token.approve(address(vaquita), type(uint).max);
        vm.prank(bob);
        token.approve(address(vaquita), type(uint).max);
        vm.prank(charlie);
        token.approve(address(vaquita), type(uint).max);
        
        // Approve l2Pool to spend tokens
        vm.prank(address(vaquita));
        token.approve(address(l2Pool), type(uint).max);
    }

    function testInitializeRoundWithL2Pool() public {
        vm.prank(alice);
        vaquita.initializeRound(roundId, paymentAmount, IERC20(address(token)), numberOfPlayers, frequencyOfPayments);
        
        (uint _paymentAmount, address _tokenAddress, uint _numberOfPlayers, , uint _availableSlots, uint _frequencyOfPayments, VaquitaBase.RoundStatus _status) = vaquita.getRoundInfo(roundId);
        
        assertEq(_paymentAmount, paymentAmount);
        assertEq(_tokenAddress, address(token));
        assertEq(_numberOfPlayers, numberOfPlayers);
        assertEq(_availableSlots, numberOfPlayers - 1);
        assertEq(_frequencyOfPayments, frequencyOfPayments);
        assertEq(uint(_status), uint(VaquitaBase.RoundStatus.Pending));
        
        // Check that alice's position was assigned
        uint alicePosition = vaquita.getPlayerPosition(roundId, alice);
        assertLt(alicePosition, numberOfPlayers);
        
        // Verify L2Pool interaction - check that the deposit was made with the correct reserve ID
        uint expectedLock = paymentAmount * (numberOfPlayers - 1);
        assertEq(l2Pool.deposits(address(token)), expectedLock);
    }

    function testAddPlayerWithL2Pool() public {
        vm.prank(alice);
        vaquita.initializeRound(roundId, paymentAmount, IERC20(address(token)), numberOfPlayers, frequencyOfPayments);
        
        vm.prank(bob);
        vaquita.addPlayer(roundId);
        
        (, , , , uint availableSlots, , VaquitaBase.RoundStatus status) = vaquita.getRoundInfo(roundId);
        assertEq(availableSlots, 1);
        
        vm.prank(charlie);
        vaquita.addPlayer(roundId);
        
        (, , , , availableSlots, , status) = vaquita.getRoundInfo(roundId);
        assertEq(availableSlots, 0);
        assertEq(uint(status), uint(VaquitaBase.RoundStatus.Active));
        
        // Verify L2Pool interaction
        uint expectedTotalLock = paymentAmount * (numberOfPlayers - 1) * numberOfPlayers;
        assertEq(l2Pool.deposits(address(uint160(USDC_RESERVE_ID))), expectedTotalLock);
    }

    function testWithdrawFundsWithL2Pool() public {
        // Set up a completed round
        testAddPlayerWithL2Pool();
        
        // Complete all turns
        _completeAllTurns();
        
        // Simulate interest earned
        uint interestAmount = 30 * 10**6; // 30 USDC interest
        l2Pool.addInterest(address(uint160(USDC_RESERVE_ID)), interestAmount);
        aToken.mint(address(vaquita), interestAmount);
        
        // First withdrawal should trigger interest calculation and distribution
        uint balanceBefore = token.balanceOf(alice);
        
        vm.prank(alice);
        vaquita.withdrawFunds(roundId);
        
        uint balanceAfter = token.balanceOf(alice);
        
        // Should get back at least collateral
        uint collateral = (numberOfPlayers - 1) * paymentAmount;
        assertGe(balanceAfter - balanceBefore, collateral);
    }

    function testRegisterATokenWithReserveId() public {
        // Test registering a new token with a different reserve ID
        TestUSDC newToken = new TestUSDC();
        MockAToken newAToken = new MockAToken(address(newToken));
        uint16 newReserveId = 3;
        
        vaquita.registerAToken(address(newToken), address(newAToken), newReserveId);
        
        // Verify that the token was registered with the correct reserve ID
        assertEq(vaquita.tokenToAToken(address(newToken)), address(newAToken));
        assertEq(vaquita.tokenToReserveId(address(newToken)), newReserveId);
    }

    function testL2EncoderIntegration() public {
        // Test that the L2Encoder is correctly encoding parameters
        // This is an internal function, so we'll test it indirectly through the supply function
        
        vm.prank(alice);
        vaquita.initializeRound(roundId, paymentAmount, IERC20(address(token)), numberOfPlayers, frequencyOfPayments);
        
        // Verify that the correct amount was supplied to the L2Pool
        uint expectedLock = paymentAmount * (numberOfPlayers - 1);
        assertEq(l2Pool.deposits(address(uint160(USDC_RESERVE_ID))), expectedLock);
        
        // Verify that the user deposit was recorded correctly
        assertEq(l2Pool.userDeposits(address(uint160(USDC_RESERVE_ID)), address(vaquita)), expectedLock);
    }

    function _completeAllTurns() internal {
        // Helper function to complete all turns in the round
        for (uint i = 0; i < numberOfPlayers; i++) {
            address currentPlayer = i == 0 ? alice : (i == 1 ? bob : charlie);
            address[] memory otherPlayers = new address[](2);
            uint count = 0;
            
            if (currentPlayer != alice) otherPlayers[count++] = alice;
            if (currentPlayer != bob) otherPlayers[count++] = bob;
            if (currentPlayer != charlie && count < 2) otherPlayers[count] = charlie;
            
            for (uint j = 0; j < 2; j++) {
                vm.prank(otherPlayers[j]);
                vaquita.payTurn(roundId);
            }
        }
    }
} 