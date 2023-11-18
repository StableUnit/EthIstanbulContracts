// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { IUniswapV3Pool } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "../vendor/uniswap/PoolAddress.sol";
import "../vendor/uniswap/OracleLibrary.sol";
import "../interfaces/oracle/ISuUniV3Oracle.sol";
import "../access-control/SuAuthenticated.sol";

/**
 * @notice check SuUniV3Oracle section in ORACLE_ARCHITECTURE.md
 * @dev Here we calculate only the price of asset in USDT, not USD.
 * Before that we need to enableAssetPool, to know what pool use for that asset (what fees).
 * See ISuUniV3Oracle interface for full details.
**/
contract SuUniV3Oracle is SuAuthenticated, ISuUniV3Oracle {
    mapping (address => IUniswapV3Pool) public override assetToPool;

    address public UNISWAP_FACTORY;
    address public USDT;
    address public ORACLE;

    function initialize(
        address _authControl,
        address _UNISWAP_FACTORY,
        address _USDT,
        address _ORACLE
    ) public initializer {
        __suAuthenticatedInit(_authControl);
        UNISWAP_FACTORY = _UNISWAP_FACTORY;
        USDT = _USDT;
        ORACLE = _ORACLE;
    }

    function getPool(address _asset, uint24 _fee) internal view returns (IUniswapV3Pool pool) {
        pool = IUniswapV3Pool(PoolAddress.computeAddress(UNISWAP_FACTORY, PoolAddress.getPoolKey(_asset, USDT, _fee)));
    }

    function enableAssetPool(address _asset, uint24 _fee) external override onlyAdmin {
        assetToPool[_asset] = getPool(_asset, _fee);
    }

    function getFiatPrice1e18(address asset) public override view returns (uint256) {
        return ISuOracle(ORACLE).getFiatPrice1e18(USDT) * estimateAmountOut(assetToPool[asset], asset, 1e18, 10) / 1e18;
    }

    function estimateAmountOut(
        IUniswapV3Pool pool,
        address tokenIn,
        uint128 amountIn,
        uint32 secondsAgo
    ) internal view returns (uint256 amountOut) {
        address token0 = pool.token0();
        address token1 = pool.token1();
        if (tokenIn != token0 && tokenIn != token1) revert InvalidToken();

        address tokenOut = tokenIn == token0 ? token1 : token0;

        // (int24 tick, ) = OracleLibrary.consult(pool, secondsAgo);
        // Gas optimization: code copied from OracleLibrary.sol, consult()
        uint32[] memory secondsAgos = new uint32[](2);
        secondsAgos[0] = secondsAgo;
        secondsAgos[1] = 0;

        (int56[] memory tickCumulatives, ) = pool.observe(secondsAgos);

        int56 tickCumulativesDelta = tickCumulatives[1] - tickCumulatives[0];

        int24 tick = int24(tickCumulativesDelta / int56(uint56(secondsAgo)));
        // Always round to negative infinity
        if (tickCumulativesDelta < 0 && (tickCumulativesDelta % int56(uint56(secondsAgo)) != 0)) tick--;

        amountOut = OracleLibrary.getQuoteAtTick(
            tick,
            amountIn,
            tokenIn,
            tokenOut
        );
    }
}
