// SPDX-License-Identifier: BSL 1.1
pragma solidity ^0.8.0;

enum DiscountType {
    aggressive,
    middle,
    conservative
}

struct Order {
    address token2sell;
    uint256 amountLeft;
    address token2buy;
    uint256 token2buyAmount;
    address beneficiary;
    uint256 creationTimestamp;
    DiscountType discountType;
    address caller;
}

struct OrderWithId {
    Order order;
    uint256 orderId;
}

interface IExchange {
    /* ===================== ERRORS ===================== */
    error OrderExist(uint256 orderId);
    error OrderNotExist(uint256 orderId);
    error IncorrectToken(address orderToken2buy, address inToken);
    error SmallAmountLeft();
    error UserIsNotBeneficiary();
    error IsNotTopStaker(address staker);
    error OrderNotForThisStaker(uint256 orderId, address staker);
    error NotEnoughReturnValue();
    error CallbackError();

    /* ======================== EVENTS ========================= */
    event OrderAdded(uint256 orderId);
    event OrderCanceled(uint256 orderId);
    event OrderFilled(uint256 orderId);
    event OrderFilledPartially(uint256 orderId);
    event LpOrdersAdded(address LPToken, uint256[] orderIds);

    /* ==================== MUTABLE METHODS ==================== */

    /**
      * @notice Add order to swap {token2sell} to {token2buy}.
      * @dev This swap is async, because depends on how arbitrage bots will fill this order. Emits OrderAdded() event.
      * Before addOrder user needs to approve token2sell for exchange contract
      * @param token2sell - Address of token to sell
      * @param amount2sell - Amount of {token2sell} to sell
      * @param token2buy - Address of token to buy
      * @param beneficiary - Address that will receive {token2buy} after filling order.
      * @param discountType - Speed of decreasing swap price. { 0 - aggressive, 1 - middle, 2 - conservative }
     **/
    function addOrder (
        address token2sell,
        uint256 amount2sell,
        address token2buy,
        address beneficiary,
        DiscountType discountType
    ) external returns (uint256);

    /**
      * @notice Only user who place order or who is beneficiary can cancelOrder();
      * @param orderId - Id of order to cancel.
     **/
    function cancelOrder (uint256 orderId) external;

    /**
      * @notice Fill order with flash-loan like logic
      * @dev Caller contract receive orders {token2sell} and after that his stableunitFillOrderCallback() is called.
      * At the end of thi callback contract should send some amount of another token back to Exchange contract.
      * @param orderId - Id of order to fill.
      * @param inAmount - Amount of {token2sell} to receive
      * @param data - encoded data to pass to callback function
     **/
    function fillOrderAsFlashLoan (
        uint256 orderId,
        uint256 inAmount,
        bytes memory data
    ) external returns (uint256 outAmount);

    /**
      * @notice Function to update price curve - how fast {token2sell} price will decrease/increase
      * @param discountType - discount type to change
      * @param newPriceCurve - parameters of formula
     **/
    function setPriceCurve(DiscountType discountType, uint256[2] calldata newPriceCurve) external;

    /* ==================== VIEW METHODS ==================== */
    /**
      * @return The amount of outcome that caller will receive if he will fill {orderId} with {inAmount} of {token2sell}
     **/
    function getExpectedOrderOutcome (uint256 orderId, uint256 inAmount) external view returns (uint256);

    /**
      * @return Order with id = {orderId}
     **/
    function getOrder (uint256 orderId) external view returns (Order memory);

    /**
      * @return The amount of not full-filled orders
     **/
    function getOrdersCount () external view returns (uint256);

    /**
      * @return The array of all not-filled orders. May be deleted after adding GraphQL for orderIds
     **/
    function getAllOrders () external view returns (OrderWithId[] memory);
}
