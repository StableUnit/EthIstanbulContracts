// SPDX-License-Identifier: BSL 1.1
pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";

import "../interfaces/IExchange.sol";
import "../interfaces/ITopStakers.sol";
import "../interfaces/IExchangeCallback.sol";
import "../../access-control/SuAuthenticated.sol";
import "../../interfaces/oracle/ISuOracle.sol";

/**
 * @title Exchange
 * @notice Main contract of Exchange module. Here we can add order or fill it to get profit.
 * @dev See IExchange interface for full details.
 */
contract Exchange is SuAuthenticated, IExchange {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;
    // todo: add enumerableSet of all IDs
    mapping (uint256 => Order) public orders;
    EnumerableSetUpgradeable.UintSet private orderIdSet;

    /**
     * @notice priceCurve is like price_t = price_0 * (1 - t/priceCurve[0]) - priceCurve[1]
     * from timePassed = 0 to t priceCurve decrease linear, but after t (when discount is 20%), it's constant
    **/
    mapping (DiscountType => uint256[2]) public priceCurve;

    /**
     * @notice Amount of minimum amountLeft in order. It's measured in fiat.
     * For example DUST_THRESHOLD = 100 * 1e18 => it's 100 USD
    **/
    uint256 public DUST_THRESHOLD;
    ISuOracle public ORACLE;
    ITopStakers public TOP_STAKERS;

    function initialize(
        address _authControl,
        address _oracleAddress,
        address _topStakersAddress
    ) public initializer {
        __suAuthenticatedInit(_authControl);

        // -20% for 3min/10h/24h
        priceCurve[DiscountType.aggressive] = [180 * 5, 0];
        priceCurve[DiscountType.middle] = [36_000 * 5, 0];
        priceCurve[DiscountType.conservative] = [86_400 * 5, 0];
        DUST_THRESHOLD = 100 * 1e18;

        ORACLE = ISuOracle(_oracleAddress);
        TOP_STAKERS = ITopStakers(_topStakersAddress);
    }

    function setPriceCurve(DiscountType discountType, uint256[2] calldata newPriceCurve) public onlyDAO {
        priceCurve[discountType] = newPriceCurve;
    }

    function addOrder(
        address token2sell,
        uint256 amount2sell,
        address token2buy,
        address beneficiary,
        DiscountType discountType
    ) external returns (uint256 orderId) {
        TransferHelper.safeTransferFrom(token2sell, msg.sender, address(this), amount2sell);

        orderId = uint256(
            keccak256(
                abi.encodePacked(block.number, msg.sender, token2sell, amount2sell, token2buy)
            )
        );
        if (orders[orderId].creationTimestamp != 0) orderId += 1;
        if (orders[orderId].creationTimestamp != 0) revert OrderExist(orderId);

        orders[orderId] = Order(
            token2sell,
            amount2sell,
            token2buy,
            0, // token2buyAmount at start should be 0
            beneficiary,
            block.timestamp,
            discountType,
            msg.sender
        );
        EnumerableSetUpgradeable.add(orderIdSet, orderId);
        emit OrderAdded(orderId);
    }

    function cancelOrder(uint256 orderId) public {
        Order memory order = orders[orderId];

        if (order.creationTimestamp == 0) revert OrderNotExist(orderId);
        if (msg.sender != order.beneficiary && msg.sender != order.caller) revert UserIsNotBeneficiary();

        TransferHelper.safeTransfer(order.token2sell, msg.sender, order.amountLeft);
        delete orders[orderId];
        EnumerableSetUpgradeable.remove(orderIdSet, orderId);

        emit OrderCanceled(orderId);
    }

    /**
     * @notice Return discounted price of token depending on passed time and type of discount
     * @dev orderPrice = x * 10^18 * 10^(18 - decimals) like in Oracle
    **/
    function getDiscountedTokenPrice(
        address token2sell,
        uint256 timePassed,
        DiscountType discountType
    ) internal view returns (uint256) {
        uint256 curveDiv = priceCurve[discountType][0];
        uint256 curveSub = priceCurve[discountType][1];
        uint256 price = ORACLE.getFiatPrice1e18(token2sell);

        if (timePassed > curveDiv) {
            // minimum is 80%;
            return price * 8 / 10;
        }

        return price - price * timePassed / curveDiv - curveSub;
    }

    function getExpectedOrderOutcome(uint256 orderId, uint256 inAmount) public view returns (uint256 outAmount) {
        Order memory order = orders[orderId];
        uint256 timePassed = block.timestamp - order.creationTimestamp;

        // Let's assume that: inAmount = x * 10^d1, discountedTokenPrice = p1 * 10^(36 - d1), priceB = p2 * 10^(36 - d2)
        // Then outAmount = x * 10^d1 * p1 * 10^(36 - d1) / (p2 * 10^(36 - d2)) = (x * p1 / p2) * 10^(d2)
        uint256 discountedTokenPrice = getDiscountedTokenPrice(order.token2sell, timePassed, order.discountType);
        uint256 priceB = ORACLE.getFiatPrice1e18(order.token2buy);
        outAmount = inAmount * discountedTokenPrice / priceB;
    }

    // TODO: add reentrancy lock
    function fillOrderAsFlashLoan(
        uint256 orderId,
        uint256 inAmount,
        bytes memory data
    ) external returns (uint256 outAmount) {
        Order storage order = orders[orderId];

        if (order.creationTimestamp == 0) revert OrderNotExist(orderId);

        uint256 timePassed = block.timestamp - order.creationTimestamp;

        // grace period
        // solhint-disable-next-line no-empty-blocks
        if (timePassed <= 60) {
            /**
                // check that msg.sender is in TopStaker list + it's on position {orderId % x}
                uint256 numberOfStakers = TOP_STAKERS.getTopStakersLength();
                // TODO: update top stakers to be able to give "stake power" to another address
                if (!TOP_STAKERS.isTopStaker(tx.origin)) revert IsNotTopStaker(tx.origin);
                if (
                    uint160(tx.origin) % numberOfStakers != orderId % numberOfStakers
                ) revert OrderNotForThisStaker(orderId, tx.origin);
            */
            // solhint-disable-next-line no-empty-blocks
        } else {
            // check that msg.sender is in TopStaker list
        }

        if (inAmount > order.amountLeft) {
            inAmount = order.amountLeft;
        }

        // the same as in getExpectedOrderOutcome
        uint256 discountedTokenPrice = getDiscountedTokenPrice(order.token2sell, timePassed, order.discountType);
        uint256 priceB = ORACLE.getFiatPrice1e18(order.token2buy);
        outAmount = inAmount * discountedTokenPrice / priceB;

        order.token2buyAmount += outAmount;
        order.amountLeft -= inAmount;

        // If in order some token amount left after updating it
        // then it should have value > DUST_THRESHOLD, counted in fiat
        if (order.amountLeft > 0 && discountedTokenPrice * order.amountLeft / 1e18 <= DUST_THRESHOLD) {
            revert SmallAmountLeft();
        }

        TransferHelper.safeTransfer(order.token2sell, msg.sender, inAmount);

        uint256 balanceBefore = IERC20(order.token2buy).balanceOf(address(this));
        if(!IExchangeCallback(msg.sender).stableunitFillOrderCallback(order.token2buy, outAmount, msg.sender, data)) {
            revert CallbackError();
        }
        uint256 balanceAfter = IERC20(order.token2buy).balanceOf(address(this));
        if (balanceAfter < balanceBefore + outAmount) revert NotEnoughReturnValue();

        // TODO: check tokenomics with profit to exchange/middleware
        TransferHelper.safeTransfer(order.token2buy, order.beneficiary, outAmount);

        if (order.amountLeft == 0) {
            delete orders[orderId];
            EnumerableSetUpgradeable.remove(orderIdSet, orderId);
            emit OrderFilled(orderId);
        } else {
            emit OrderFilledPartially(orderId);
        }
    }

    function getOrder (uint256 orderId) public view returns (Order memory) {
        return orders[orderId];
    }

    function getOrdersCount() public view returns (uint256) {
        return EnumerableSetUpgradeable.length(orderIdSet);
    }

    // TODO: add pagination
    /**
     * @notice This method will be deleted after we'll add GraphQL to watch orders
    **/
    function getAllOrders() external view returns (OrderWithId[] memory) {
        uint256[] memory orderIdValues = EnumerableSetUpgradeable.values(orderIdSet);
        uint256 len = orderIdValues.length;
        OrderWithId[] memory result = new OrderWithId[](len);
        for (uint256 i = 0; i < len; i++) {
            uint256 orderId = orderIdValues[i];
            result[i] = OrderWithId({
                order: orders[orderId],
                orderId: orderId
            });
        }
        return result;
    }

    function supportsInterface(bytes4 interfaceId) public pure override returns (bool) {
        return interfaceId == type(IExchange).interfaceId;
    }

    uint256[45] private __gap;
}
