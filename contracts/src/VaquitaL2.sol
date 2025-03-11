// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VaquitaBase.sol";
import "./interfaces/IL2Pool.sol";
import "./interfaces/IL2Encoder.sol";
import "./interfaces/IAave.sol";

contract VaquitaL2 is VaquitaBase {
    // Aave L2Pool contract for yield generation
    IL2Pool public immutable aavePool;
    
    // L2Encoder for parameter encoding
    IL2Encoder public immutable l2Encoder;
    
    // Mapping from token to reserve ID
    mapping(address => uint16) public tokenToReserveId;

    event ReserveIdRegistered(address token, uint16 reserveId);

    error InvalidReserveId();

    constructor(address _aavePool, address _l2Encoder) VaquitaBase() {
        aavePool = IL2Pool(_aavePool);
        l2Encoder = IL2Encoder(_l2Encoder);
    }

    function registerAToken(address token, address aToken, uint16 reserveId) external onlyOwner {
        // Verify that aToken's underlying asset is the token
        IAToken aTokenContract = IAToken(aToken);
        if (aTokenContract.UNDERLYING_ASSET_ADDRESS() != token) {
            revert InvalidAToken();
        }
        
        tokenToAToken[token] = aToken;
        tokenToReserveId[token] = reserveId;
        
        emit ATokenRegistered(token, aToken);
        emit ReserveIdRegistered(token, reserveId);
    }

    function _supplyToAave(IERC20 token, uint amount) internal override {
        address aTokenAddress = tokenToAToken[address(token)];
        uint16 reserveId = tokenToReserveId[address(token)];
        
        if (aTokenAddress != address(0)) {
            // Approve Aave pool to spend the tokens
            SafeERC20.forceApprove(token, address(aavePool), amount);
            
            // Encode parameters and supply to Aave
            bytes32 args = l2Encoder.encodeSupplyParams(reserveId, amount, 0);
            aavePool.supply(args);
        }
    }

    function _withdrawFromAave(IERC20 token, uint amount) internal override {
        address aTokenAddress = tokenToAToken[address(token)];
        uint16 reserveId = tokenToReserveId[address(token)];
        
        if (aTokenAddress != address(0)) {
            // Encode parameters and withdraw from Aave
            bytes32 args = l2Encoder.encodeWithdrawParams(reserveId, amount);
            aavePool.withdraw(args);
        }
    }

    function _calculateTotalInterest(IERC20 token, uint principalAmount) internal view override returns (uint) {
        address aTokenAddress = tokenToAToken[address(token)];
        if (aTokenAddress == address(0)) {
            return 0; // No aToken registered for this token
        }
        
        // Get current aToken balance
        IAToken aToken = IAToken(aTokenAddress);
        uint aTokenBalance = aToken.balanceOf(address(this));
        
        // Interest is the difference between aToken balance and principal
        if (aTokenBalance > principalAmount) {
            return aTokenBalance - principalAmount;
        }
        return 0;
    }
} 