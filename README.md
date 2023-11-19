# MeowLend Protocol PoC

// abstract and link for hackathon submission tba

## Deploys

### polygonZK addresses
**lend** 0x2a958EFb0dCd381c036675D564c08eB1909C38AC

**oracle** 0x97eaA69F210426eaC3A391d6d4377cfe85443494

**oracleAggregator** 0xDF2e747Ae22Ea80B5f6C8f8BA8FDC2FAAC996762

**accessControlSingleton** 0x708071C080E5ceb3cc0fb8fb4fD1034766eAef24

# Lending Protocol Specification

## Overview
The lending protocol facilitates two main activities for users:
1. **Deposit and Earn Interest:** Users can deposit a specific ERC20 token into the pool to earn interest.
2. **Borrow Against Collateral:** Users can deposit ETH as collateral to borrow the ERC20 tokens.

## Key Components

### ERC20 Token Pool
- Users deposit ERC20 tokens into the pool.
- Depositors earn interest based on pool utilization.

### ETH Collateral
- Users deposit ETH as collateral to borrow ERC20 tokens.
- The amount that can be borrowed is dependent on the Loan-to-Value (LTV) ratio.

### Interest Rate Calculation
- Interest rates for borrowers are determined based on the pool utilization rate.
- Higher utilization leads to higher interest rates.

### Loan and Repayment
- Users borrow ERC20 tokens against their ETH collateral.
- The borrowed amount of ERC20 tokens remains constant; however, the ETH collateral returned upon repayment will be less, accounting for the interest paid in ETH.
- Borrowers must maintain a minimum loan size to ensure the viability of the liquidation process (covering gas costs).

### Liquidation Process and Incentives
- In the event of under-collateralization, the loan becomes eligible for liquidation.
- The protocol uses the ETH collateral to purchase ERC20 tokens via Uniswap to cover the debt.
- A portion of the ETH collateral (a small percentage) is awarded to the caller of the liquidation function as an incentive to cover their transaction (gas) costs.

## Functionalities

### `depositTokens(tokenAmount)`
- Allows users to deposit ERC20 tokens into the pool.
- Updates the user's deposit balance and total token deposits in the pool.

### `withdrawTokens(tokenAmount)`
- Allows users to withdraw their deposited ERC20 tokens along with accrued interest.

### `depositCollateral()` (payable)
- Users deposit ETH as collateral.
- The amount of ETH deposited is tracked as the user's collateral balance.

### `borrowToken(tokenAmount)`
- Users can borrow ERC20 tokens against their ETH collateral, subject to a minimum loan size to ensure the liquidation process is gas cost-effective.
- Checks the LTV ratio to determine the maximum and minimum borrowable amounts.

### `repayLoanAndWithdraw(tokenAmount)`
- Users repay the borrowed ERC20 tokens.
- The interest for the loan is paid in ETH, and the remaining ETH collateral (minus interest) is returned to the user.

### `liquidateLoan(borrower)`
- Can be called on under-collateralized loans.
- Converts the borrower's ETH collateral into ERC20 tokens via Uniswap to cover the debt.
- Awards a percentage of the ETH collateral to the liquidator to cover gas costs.

## Additional Considerations

- **Security Measures:** Implement reentrancy guards and other security best practices.
- **Dynamic Interest Rates:** The interest rate model should be robust to handle rapid changes in market conditions.
- **Uniswap Price Feeds:** May require integration with oracle services for accurate ETH to ERC20 conversion rates.
- **Regulatory Compliance:** Be aware of legal and regulatory requirements in jurisdictions where the protocol operates.

