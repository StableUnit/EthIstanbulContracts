# MeowLend Protocol PoC

## Deploys

### polygonZK addresses
**lend** 0x2a958EFb0dCd381c036675D564c08eB1909C38AC

**oracle** 0x97eaA69F210426eaC3A391d6d4377cfe85443494

**shib** 0x7a1adc8340C00AA3Ecdd4Ecf36182Eed5D1BAb0B

**accessControlSingleton** 0x708071C080E5ceb3cc0fb8fb4fD1034766eAef24

**oracleAggregator** 0xDF2e747Ae22Ea80B5f6C8f8BA8FDC2FAAC996762

### ArbitrumOne addresses
**lend** 0x6b2cD9F0Eb10E377c718753575B319D8C38Ad33c

**oracle** 0x519dD028CE0c4B20ae647619487C9512A845C64A

**shib** 0x59f867dBb335A0E51e8ce010F0Db17eD8c2D935c

**accessControlSingleton** 0x5121232FA8DC5c49a9a320567813809bbCC06cB9

**oracleAggregator** 0x79F93C0778c53Ce9dC306cC28aa145e2379d97e2

### Celo addresses
**lend** 0x2a958EFb0dCd381c036675D564c08eB1909C38AC

**oracle** 0x97eaA69F210426eaC3A391d6d4377cfe85443494

**shib** 0x7a1adc8340C00AA3Ecdd4Ecf36182Eed5D1BAb0B

**accessControlSingleton** 0x708071C080E5ceb3cc0fb8fb4fD1034766eAef24

**oracleAggregator** 0xDF2e747Ae22Ea80B5f6C8f8BA8FDC2FAAC996762

### Chiliz addresses
**lend** 0x4274163619a3E4EA3C310a93C4B2f827F07FC5a4

**oracle** 0x11F9724E795Ce0CD9E0366286eA45C1BC578E984

**shib** 0x43bf5867544FebB4E89139b01ef15DCbC9E5A674

**accessControlSingleton** 0xDF2e747Ae22Ea80B5f6C8f8BA8FDC2FAAC996762

**oracleAggregator** 0x7a1adc8340C00AA3Ecdd4Ecf36182Eed5D1BAb0B

### Scroll addresses
**lend** 0x2a958EFb0dCd381c036675D564c08eB1909C38AC

**oracle** 0x97eaA69F210426eaC3A391d6d4377cfe85443494

**shib** 0x7a1adc8340C00AA3Ecdd4Ecf36182Eed5D1BAb0B

**accessControlSingleton** 0x708071C080E5ceb3cc0fb8fb4fD1034766eAef24

**oracleAggregator** 0xDF2e747Ae22Ea80B5f6C8f8BA8FDC2FAAC996762

### Mantle addresses
**lend** 0x2a958EFb0dCd381c036675D564c08eB1909C38AC

**oracle** 0x97eaA69F210426eaC3A391d6d4377cfe85443494

**shib** 0x7a1adc8340C00AA3Ecdd4Ecf36182Eed5D1BAb0B

**accessControlSingleton** 0x708071C080E5ceb3cc0fb8fb4fD1034766eAef24

**oracleAggregator** 0xDF2e747Ae22Ea80B5f6C8f8BA8FDC2FAAC996762

### Base addresses
**lend** 0x2a958EFb0dCd381c036675D564c08eB1909C38AC

**oracle** 0x97eaA69F210426eaC3A391d6d4377cfe85443494

**shib** 0x7a1adc8340C00AA3Ecdd4Ecf36182Eed5D1BAb0B

**accessControlSingleton** 0x708071C080E5ceb3cc0fb8fb4fD1034766eAef24

**oracleAggregator** 0xDF2e747Ae22Ea80B5f6C8f8BA8FDC2FAAC996762

## Developer Feedback

### Chronicle:
- Can’t find any example of oracle usage. For example what changed if we want to use Chronicle instead of Chainlink.
- Not clear why we need to whitelist address to be able to call latestRoundData
- It will be helpful to test if there was also all contract addresses on mainnet (not only Sepolia)
- At first it was not so clear what is oracle and what is feed
- Cool, that there is a good usage as Chainlink

### Neon:
- https://proxy.devnet.neonlabs.org/solana returns HeadersTimeoutError: Headers Timeout Error
- https://devnet.neonevm.org RPC returns:
  - Error HH110: Invalid JSON-RPC response received: <html>
    <head><title>502 Bad Gateway</title></head>
- Cool faucet
- Contract verification isn't supported by default by hardhat

### Base:
- Very slow deploy on testnet. As in another chains we don't set gas, but 10 minutes after starting deploy it happens nothing
- Mainnet deploy work fast
- Faucet for Base Goerly didn't work, so we need to use Base Sepolia
- Contract verification isn't supported by default by hardhat

### Mantle
- Only faucet with bridge works for me (https://faucet.testnet.mantle.xyz/), it's complex, but the bridge works fast, that was very good
- Contract verification isn't supported by default by hardhat

### Celo
- Great faucet
- It's bad that there is no injected in hardhat verifier, but it's cool that there is hardhat-celo. Not many chain do that.

### PolygonZK
- Mainnet works fast
- Comfortable native bridge
- It'll be nice if I can natively bridge matic from polygon to eth to polygonZK
- Contract verification isn't supported by default by hardhat

### Chiliz
- Faucet: Not clear why we need to create a tweet, why not to do like in another faucets - x CHZ is free, if we only connect github/Alchemy/twitter => we get (n * x) CHZ
- But it's good that there is a lot of mocked tokens available in testnet faucet
- Deploy works fast
- Contract verification isn't supported by default by hardhat

### Arbitrum
- Only tried on mainnet, but it works perfect and fast
- It's very good that there is hardhat verification with Arbitrum mainnet and testnet

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

