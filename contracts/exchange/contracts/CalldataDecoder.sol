// SPDX-License-Identifier: BSL 1.1
pragma solidity ^0.8.0;

struct SwapDescription {
    address srcToken;
    address dstToken;
    address srcReceiver;
    address dstReceiver;
    uint256 amount;
    uint256 minReturnAmount;
    uint256 flags;
}

/**
 * @notice Helper abstract contract to work with calldata
**/
abstract contract CalldataDecoder {
    /**
     * @notice We need this functions to check their selector and functionSelector in calldata
     * for changeCalldataAmount() function
    **/
    /* solhint-disable no-empty-blocks */
    function uniswapV3Swap(uint256, uint256, uint256[] calldata) public pure {}
    function unoswap(address, uint256, uint256, uint256[] calldata) public pure {}
    function swap(address, SwapDescription calldata, bytes calldata, bytes calldata) public pure {}
    function clipperSwap(
        address clipperExchange,
        address srcToken,
        address dstToken,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 goodUntil,
        bytes32 r,
        bytes32 vs
    ) public pure {}
    /* solhint-enable no-empty-blocks */

    // TODO: add comment about minAmount
    // TODO: use byteToChange position in TS + check how much gas spent
    /**
      * @notice
      * Helper function to change amount parameter on callback that depends on return by 1inch API calldata for swap
      * We set minAmount to 1 to be sure, that swap will be created. Route path don't depend on that -
      * this path was calculated previously in backend part and is stored in {data}.
      * @param data - calldata to edit
      * @param newAmount - new amount that should replace amount in {data}
      * @return edited calldata with new amount inside
     **/
    function changeCalldataAmount(bytes calldata data, uint256 newAmount) public pure returns (bytes memory) {
        bytes4 functionSelector = bytes4(data[:4]);
        if (functionSelector == this.uniswapV3Swap.selector) {
            (
                /*uint256 _amount */, /*uint256 minReturn*/, uint256[] memory pools
            ) = abi.decode(data[4:], (uint256, uint256, uint256[]));
            return abi.encodeWithSignature("uniswapV3Swap(uint256,uint256,uint256[])", newAmount, 1, pools);
        }
        if (functionSelector == this.unoswap.selector) {
            (
                address token, /* uint256 _amount */, /*uint256 minReturn*/, uint256[] memory pools
            ) = abi.decode(data[4:], (address,uint256,uint256,uint256[]));
            return abi.encodeWithSignature("unoswap(address,uint256,uint256,uint256[])", token, newAmount, 1, pools);
        }
        if (functionSelector == this.swap.selector) {
            (
                address caller, SwapDescription memory description, bytes memory permit, bytes memory swapData
            ) = abi.decode(data[4:], (address, SwapDescription, bytes, bytes));
            return abi.encodeWithSignature(
                "swap(address,(address,address,address,address,uint256,uint256,uint256),bytes,bytes)",
                caller,
                SwapDescription({
                    srcToken: description.srcToken,
                    dstToken: description.dstToken,
                    srcReceiver: description.srcReceiver,
                    dstReceiver: description.dstReceiver,
                    amount: newAmount,
                    minReturnAmount: 1,
                    flags: description.flags
                }),
                permit,
                swapData
            );
        }
        if (functionSelector == this.clipperSwap.selector) {
            (
                address clipperExchange,
                address srcToken,
                address dstToken,
                /*uint256 _inputAmount*/,
                /*uint256 outputAmount*/,
                uint256 goodUntil,
                bytes32 r,
                bytes32 vs
            ) = abi.decode(data[4:], (address, address, address, uint256, uint256, uint256, bytes32, bytes32));
            return abi.encodeWithSignature(
                "clipperSwap(address,address,address,uint256,uint256,uint256,bytes32,bytes32)",
                clipperExchange,
                srcToken,
                dstToken,
                newAmount,
                1,
                goodUntil,
                r,
                vs
            );
        }

        return data;
    }
}
