// SPDX-License-Identifier: BSL 1.1
pragma solidity ^0.8.0;

import "./IExchangeCallback.sol";

struct FlashCallbackData {
    uint256 orderId;
    address token2sell;
    uint256 token2sellAmount;
    address recipient;
    InchData inchData;
}

struct ParaswapData {
    address contractAddress;
    address tokenTransferProxy;
    bytes data;
}

struct InchData {
    address contractAddress;
    bytes data;
}

interface IArbitrageHelper is IExchangeCallback {
    /* ===================== ERRORS ===================== */
    error NotAPool(address sender);
    error SwapNotProfitable();
    error SwapByParaSwapError();
    error SwapBy1InchError();
    error BadSender(address sender);

    /* ===================== EVENTS ===================== */
    // event SwapByUniswap(address tokenA, address tokenB);

    /* ==================== MUTABLE METHODS ==================== */

    /**
      * @notice Reference implementation of Arbitrage bot contract, that use Exchange module to get profit
      * @dev Contract receive loan from exchange module, sell it on 1inch and get profit = received amount - fee
      * @param orderId - Id of order in Exchange module to fill
      * @param token2sell - Token in order to get as flash-loan
      * @param token2sellAmount - Amount of token in order to get as flash-loan
      * @param inchData - 1inch callData and contract to swap loan
     **/
    function swapWithFlashLoan(
        uint256 orderId,
        address token2sell,
        uint256 token2sellAmount,
        InchData memory inchData
    ) external;
}