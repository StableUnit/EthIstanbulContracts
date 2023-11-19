// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

interface IUniswapV2Router02 {
    function WETH() external pure returns (address);
    function swapExactETHForTokens(
        uint amountOutMin, 
        address[] calldata path, 
        address to, 
        uint deadline
    ) external payable returns (uint[] memory amounts);
}

contract LendingProtocol {
    using SafeMath for uint256;

    IERC20 public erc20Token;
    IUniswapV2Router02 public uniswapRouter;
    AggregatorV3Interface public priceFeed;

    uint256 public totalDeposits;
    uint256 public totalBorrowed;
    uint256 private constant LTV_RATIO = 50; // 50%
    uint256 private constant MINIMUM_LOAN_SIZE = 1 ether; // Minimum ETH collateral for a loan
    uint256 private constant LIQUIDATION_INCENTIVE = 5; // 5% of collateral

    struct Loan {
        uint256 ethCollateral;
        uint256 tokenDebt;
        uint256 lastBorrowTime;
    }

    mapping(address => Loan) public loans;

    constructor(address _erc20Token, address _uniswapRouter, address _priceFeed) {
        erc20Token = IERC20(_erc20Token);
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function depositCollateral() external payable {
        require(msg.value >= MINIMUM_LOAN_SIZE, "Collateral below minimum size");
        Loan storage loan = loans[msg.sender];
        loan.ethCollateral = loan.ethCollateral.add(msg.value);
        totalDeposits = totalDeposits.add(msg.value);
    }

    function borrowToken(uint256 tokenAmount) external {
        Loan storage loan = loans[msg.sender];
        uint256 maxBorrow = loan.ethCollateral.mul(LTV_RATIO).div(100);
        require(tokenAmount <= maxBorrow, "Amount exceeds maximum borrowable");
        
        loan.tokenDebt = loan.tokenDebt.add(tokenAmount);
        loan.lastBorrowTime = block.timestamp;
        totalBorrowed = totalBorrowed.add(tokenAmount);
        
        erc20Token.transfer(msg.sender, tokenAmount);
    }

    function repayLoanAndWithdraw(uint256 tokenAmount) external payable {
        Loan storage loan = loans[msg.sender];
        require(tokenAmount == loan.tokenDebt, "Must repay exact loan amount");

        uint256 interestInEth = calculateInterest(loan.tokenDebt, loan.lastBorrowTime);
        require(msg.value >= interestInEth, "Insufficient ETH for interest");

        erc20Token.transferFrom(msg.sender, address(this), tokenAmount);
        uint256 ethRefund = loan.ethCollateral.sub(interestInEth);
        payable(msg.sender).transfer(ethRefund);

        loan.ethCollateral = 0;
        loan.tokenDebt = 0;
        totalBorrowed = totalBorrowed.sub(tokenAmount);
    }

    function liquidateLoan(address borrower) external {
        Loan storage loan = loans[borrower];
        require(isUnderCollateralized(borrower), "Loan is not eligible for liquidation");

        uint256 ethAmount = loan.ethCollateral;
        uint256 incentiveAmount = ethAmount.mul(LIQUIDATION_INCENTIVE).div(100);
        uint256 swapAmount = ethAmount.sub(incentiveAmount);

        payable(msg.sender).transfer(incentiveAmount); // Send incentive to liquidator

        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = address(erc20Token);

        uniswapRouter.swapExactETHForTokens{value: swapAmount}(
            0, // accept any amount of ERC20 tokens
            path,
            address(this),
            block.timestamp + 15 minutes
        );

        loan.ethCollateral = 0;
        loan.tokenDebt = 0;
    }

    function calculateInterest(uint256 tokenDebt, uint256 lastBorrowTime) private view returns (uint256) {
        uint256 interestRate = calculateInterestRate();
        uint256 duration = block.timestamp.sub(lastBorrowTime);
        uint256 tokenPrice = getTokenPrice();
        uint256 interest = tokenDebt.mul(interestRate).mul(duration).div(365 days).div(100);
        return interest.mul(tokenPrice);
    }

    function calculateInterestRate() private view returns (uint256) {
        uint256 utilization = totalBorrowed.mul(100).div(totalDeposits);
        // Implement your interest rate model here
        return utilization; // Example: 1% for each 1% utilization
    }

    function isUnderCollateralized(address borrower) private view returns (bool) {
        Loan memory loan = loans[borrower];
        uint256 tokenPrice = getTokenPrice();
        uint256 collateralValue = loan.ethCollateral.mul(tokenPrice);
        return collateralValue < loan.tokenDebt.mul(LTV_RATIO).div(100);
    }

    function getTokenPrice() private view returns (uint256) {
        // Implement logic to get the current price of the ERC20 token
        // Example: using Chainlink Price Feed
        (,int256 price,,,) = priceFeed.latestRoundData();
        return uint256(price);
    }
}
