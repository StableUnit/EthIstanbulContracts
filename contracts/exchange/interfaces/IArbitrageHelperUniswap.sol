// SPDX-License-Identifier: BSL 1.1
pragma solidity ^0.8.0;

struct FlashCallbackData {
    uint256 orderId;
    address tokenA;
    address tokenB;
    uint256 tokenBAmount;
    address recipient;
    bytes path;
}

interface IArbitrageHelperUniswap {
    /* ===================== ERRORS ===================== */
    error NotAPool(address sender);
    error BadSender(address sender);
    error BadDecodedData();
    error SwapNotProfitable();

    /* ==================== MUTABLE METHODS ==================== */
    function swapWithFlashLoan(
        uint256 orderId,
        address tokenA,
        address tokenB,
        uint256 tokenBAmount,
        bytes memory path
    ) external;
}