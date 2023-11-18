// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { IUniswapV3Pool } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

import "./ISuOracle.sol";

/**
 * @title SuUniV3Oracle
 * @dev SuUniV3Oracle is an implementation of the SuOracle interface for UniswapV3.
 **/
interface ISuUniV3Oracle is ISuOracle {
    /* ===================== ERRORS ===================== */
    error InvalidToken();

    /* ====================== VARS ====================== */
    function assetToPool (address asset) external view returns ( IUniswapV3Pool );

    /* ==================== METHODS ==================== */
    function enableAssetPool(address _asset, uint24 _fee) external;
}
