// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleAMM {
    IERC20 public erc20Token;
    address public eth = address(0);

    error WrongAssumption();

    struct LendingPool {
        bool isEnabled;
        address collatrealToken;
        address memecoin;
        uint256 amountOfCollateral;
        uint256 amountOfMemecoin;
        uint256 interestRate1e18;
    }
    struct LoanInfo {
        uint256 amountOfBorrowed;
        uint256 amountOfCollateral;
        uint256 lastUpdateTimestamp;
    }
    
    mapping (uint256 => LendingPool) public pools; // pool id,
    uint256 public totalNumberOfPools;

    // Constructor to initialize the ERC20 token address
    constructor(address _erc20Address) {
        erc20Token = IERC20(_erc20Address);
    }

    function deposit (
        address collatrealToken, 
        address memecoin, 
        uint256 amountOfMemecoin
    ) public {

    }

    function borrow (
        address collatrealToken, 
        address memecoin,
        uint256 amountOfCollatrealToDeposit,
        uint256 amountOfMemecoinToBorrow
    ) public {

    }

    function repay ( 
        address collatrealToken, 
        address memecoin,
        uint256 amountOfMemecoinToReturn
    ) public {

    }

    function withdraw (
        address collatrealToken, 
        address memecoin,
        uint256 amountOfMemecoinToWithdraw 
    ) public {

    }

    function getAPR(
        address collatrealToken, 
        address memecoin
    ) public view returns (uint256) {
        return 1;
    }

    function createPool(
        address collatrealToken, 
        address memecoin
    ) public returns (uint256) {
        pools[totalNumberOfPools] = LendingPool({
            isEnabled: true,
            collatrealToken: collatrealToken,
            memecoin: memecoin,
            amountOfCollateral: 0,
            amountOfMemecoin: 0,
            interestRate1e18: 0
        });
        totalNumberOfPools = totalNumberOfPools + 1;
    }



    // Check for under-collateralized loans
    function CheckHealthFactor(uint256 loanID) public returns (uint256) {
        // Logic to check and trigger liquidation
        return 0;
    }

    // Liquidate using Uniswap
    function triggerLiquidation(uint256 loanId) public {
        if (CheckHealthFactor(loanId) > 1e18) revert WrongAssumption();

        
    }

    // Additional functions for administration and governance
}

interface IERC20 {
    // Minimal interface for ERC20
}

// Interface for Uniswap
