# ARBITRAGE HELPER

#### [ATTENTION] This section is for users, who want to participate in earning from arbitrage for StabUnit. 

## Main idea
To do that they should call ArbitrageHelper.swapWithFlashLoan(). In that function they:
1) Get flash-loan from Uniswap or Aave
2) Fill order of Exchange module with discount using loan
3) Swap liquidated collateral using Uniswap, ParaSwap or 1Inch

To monitor and trigger liquidation to earn money: use the graph or uCdpRegistry.getCdpsByCollateral(asset).

To get all orders use exchangeModule.getAllOrders()

Collaterals that could be used in StableUnit protocol may be not only popular ERC-20 tokens in small amount. For big liquidations we implement swap using 1Inch and Paraswap.

Also, LP-tokens could be used as collaterals. For that we need to unwrap them into desired token. For now, we use Curve LP tokens interface. Unwrapping is during addOrder, so arbitrage users works only with ERC-20 tokens.

## Arbitrage bot
To use default arbitrage bot, that use ArbitrageHelper smart-contract please use https://github.com/StableUnit/liquidation-bot

## Fututre features
In the future, We can use not only Curve, but Balancer and other LPs, but it doesn't change work of arbitrage users.


# EXCHANGE MODULE

#### [ATTENTION] This section is for developers.

This module is created to sell any erc-20 token to another as profitable as possible. There are also feature to sell Curve LP-tokens for another erc-20 token.

This module is used in liquidation flow of StableUnit protocol:
- Instead of using flash-loans or just stablecoin deposit in bot we can create orders, where sell discount is increasing every block or depending on CDP health factor.
- Top-21 liquidators should have privilege to liquidate position first to avoid "gas wars". Liquidations should be MEV-resistant.

## Exchange module flow in liquidation

1. SuLiquidationMiddleware choose some stablecoin and add order to swap collateral to stablecoin.
   1. LP-token can be used as collateral, so during addOrder we unwrap it and create several orders for each underline token.
2. Order in Exchange Module is created and for X seconds one of Top-21 stakers has ability to liquidate position and get profit without "gas wars".
3. After this time any arbitrage bot can liquidate position (discount is increasing every second).
4. Order is filled and now any user with StablePro can request to swap it to another stablecoin from whitelist.
5. After initial debt from step 2 in StablePro is paid to SuManager.

