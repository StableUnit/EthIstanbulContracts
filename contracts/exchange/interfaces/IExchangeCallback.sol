// SPDX-License-Identifier: BSL 1.1
pragma solidity ^0.8.0;

interface IExchangeCallback {
    /**
     * @notice Callback that will be called by Exchange module in fillOrderAsFlashLoan()
     * after sending collateral to msg.sender.
     * In the implementation you must pay stablecoin for Exchange contract.
     * @dev Any contract that calls Exchange#fillOrderAsFlashLoan must implement this interface
     * @param asset - The address of the token that should be returned
     * @param amount - The amount of the {token} to return
     * @param initiator The address of the flashloan initiator
     * @return True if the execution of the operation succeeds, false otherwise
     */
    function stableunitFillOrderCallback (
        address asset,
        uint256 amount,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}
