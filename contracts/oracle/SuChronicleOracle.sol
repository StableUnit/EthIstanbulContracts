// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

import "../access-control/SuAuthenticated.sol";
import "../interfaces/oracle/ISuOracle.sol";
import "../vendor/chronicle/IScribe.sol";

/**
 * @title SuChronicleOracle
 * @notice Oracle that use Chronicle prices
 * @dev See ISuChronicleOracle interface for full details.
 */
contract SuChronicleOracle is ISuOracle, SuAuthenticated {
    mapping (address => address) public assetToFeed;
    mapping (address => uint8) public assetToFeedDecimals;

    error BadPriceAnswer();

    function initialize(address _authControl) public initializer {
        __suAuthenticatedInit(_authControl);
    }

    function setAssetFeed(address asset, address chronicleDataFeed) external onlyDAO {
        assetToFeed[asset] = chronicleDataFeed;
    }

    function getFiatPrice1e18(address asset) public view returns (uint256) {
        address feed = assetToFeed[asset];
        (
            /*uint80 roundID*/,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = IScribe(feed).latestRoundData();
        if (answer <= 0) revert BadPriceAnswer();
        uint8 assetDecimals = asset == address(0) ? 18 : IERC20Metadata(asset).decimals();
        int256 returnedUsdPrice1e18 = scalePrice(answer, assetDecimals, 18);
        return uint256(returnedUsdPrice1e18);
    }

    function scalePrice(int256 _price, uint8 _priceDecimals, uint8 _decimals) internal pure returns (int256) {
        if (_priceDecimals < _decimals) {
            return _price * int256(10 ** uint256(_decimals - _priceDecimals));
        } else if (_priceDecimals > _decimals) {
            return _price / int256(10 ** uint256(_priceDecimals - _decimals));
        }
        return _price;
    }
}
