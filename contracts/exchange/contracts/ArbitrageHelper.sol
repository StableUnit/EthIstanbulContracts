// SPDX-License-Identifier: BSL 1.1
pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../interfaces/IArbitrageHelper.sol";
import "../interfaces/IExchange.sol";
import "./CalldataDecoder.sol";
import "../../access-control/SuAuthenticated.sol";

/**
 * @title ArbitrageHelper
 * @notice Helper contract to arbitrage using Exchange module
 * @dev See IArbitrageHelper interface for full details.
 */
contract ArbitrageHelper is SuAuthenticated, IArbitrageHelper, CalldataDecoder {
    IExchange internal EXCHANGE;

    function initialize(address _authControl, address _exchange) public initializer {
        __suAuthenticatedInit(_authControl);

        EXCHANGE = IExchange(_exchange);
    }

    /**
     * @notice Swap using Paraswap. Sell {amount2sell} token2sell to token using route encoded in paraswapData.data
     * @dev We get that data in bot using ParaSwap API (apiv5.paraswap.io)
     * Docs: https://developers.paraswap.network/api/build-parameters-for-transaction
     */
    function swapByParaswap(address token2sell, uint256 amount2sell, ParaswapData memory paraswapData) internal {
        // All token transfers are through tokenTransferProxy, so we need to make approve to this contract
        TransferHelper.safeApprove(token2sell, paraswapData.tokenTransferProxy, amount2sell);
        // solhint-disable-next-line avoid-low-level-calls
        (bool success,) = paraswapData.contractAddress.call(paraswapData.data);
        if (!success) {
            revert SwapByParaSwapError();
        }
    }
    /**
     * @notice as in swapByParaswap, look into utils/1inch.ts
     * @dev Docs: https://docs.1inch.io/docs/aggregation-protocol/api/swap-params/
     */
    function swapBy1Inch(address token2sell, uint256 amount2sell, address contractAddress, bytes memory data) internal {
        TransferHelper.safeApprove(token2sell, contractAddress, amount2sell);

        // solhint-disable-next-line avoid-low-level-calls
        (bool success,) = contractAddress.call(data);
        if (!success) {
            revert SwapBy1InchError();
        }
    }

    function swapWithFlashLoan(
        uint256 orderId,
        address token2sell,
        uint256 token2sellAmount,
        InchData memory inchData
    ) public {
        // We do a flash-loan of {token2sell} in amount of {token2sellAmount} to our contract.
        // {data} will be decoded in stableunitFillOrderCallback() - the callback after we get flash-loan
        EXCHANGE.fillOrderAsFlashLoan(
            orderId,
            token2sellAmount,
            abi.encode(FlashCallbackData({
                orderId: orderId,
                token2sell: token2sell,
                token2sellAmount: token2sellAmount,
                recipient: msg.sender,
                inchData: inchData
            }))
        );
    }

    /**
     * @notice This is callback function from Exchange contract.
     * fillOrderAsFlashLoan call (msg.sender).executeOperation(...) after transferring loan to sender
     * @dev behaviour like in uniswapV3FlashCallback:
     * https://docs.uniswap.org/contracts/v3/guides/flash-integrations/flash-callback
     * and AAVE flash-loan callback:
     * https://github.com/aave/aave-v3-core/blob/master/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol
    **/
    function stableunitFillOrderCallback(
        address asset,
        uint256 amount,
        address sender,
        bytes calldata data
    ) external returns (bool) {
        FlashCallbackData memory decoded = abi.decode(data, (FlashCallbackData));

        if (msg.sender != address(EXCHANGE)) revert NotAPool(msg.sender);
        if (sender != address(this)) revert BadSender(sender);

        uint256 balanceBefore = IERC20(asset).balanceOf(address(this));

        swapBy1Inch(
            decoded.token2sell,
            decoded.token2sellAmount,
            decoded.inchData.contractAddress,
            decoded.inchData.data
        );

        uint256 balanceAfter = IERC20(asset).balanceOf(address(this));
        uint256 tokenBReceived = balanceAfter - balanceBefore;

        if (tokenBReceived < amount) revert SwapNotProfitable();
        uint256 swapProfit = tokenBReceived - amount;

        // Return flash-loan debt to Exchange contract
        TransferHelper.safeTransfer(asset, address(EXCHANGE), amount);

        // Send swapped {asset} minus debt from flash-loan to liquidator (it's user profit)
        TransferHelper.safeTransfer(asset, decoded.recipient, swapProfit);

        return true;
    }

    uint256[45] private __gap;
}
