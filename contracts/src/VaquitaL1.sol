// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VaquitaBase.sol";
import "./interfaces/IAave.sol";

contract VaquitaL1 is VaquitaBase {
    // Aave Pool contract for yield generation
    IPool public immutable aavePool;

    constructor(address _aavePool) VaquitaBase() {
        aavePool = IPool(_aavePool);
    }

    function registerAToken(address token, address aToken) external onlyOwner {
        // Verify that aToken's underlying asset is the token
        IAToken aTokenContract = IAToken(aToken);
        if (aTokenContract.UNDERLYING_ASSET_ADDRESS() != token) {
            revert InvalidAToken();
        }
        
        tokenToAToken[token] = aToken;
        emit ATokenRegistered(token, aToken);
    }

    function _supplyToAave(IERC20 token, uint amount) internal override {
        address aTokenAddress = tokenToAToken[address(token)];
        if (aTokenAddress != address(0)) {
            // Approve Aave pool to spend the tokens
            SafeERC20.forceApprove(token, address(aavePool), amount);
            
            // Supply to Aave
            aavePool.supply(address(token), amount, address(this), 0);
        }
    }

    function _withdrawFromAave(IERC20 token, uint amount) internal override {
        address aTokenAddress = tokenToAToken[address(token)];
        if (aTokenAddress != address(0)) {
            // Withdraw from Aave
            aavePool.withdraw(address(token), amount, address(this));
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