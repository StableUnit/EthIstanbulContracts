// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../interfaces/oracle/ISuOracle.sol";

contract MockOracle is ISuOracle, Ownable {
    mapping (address => uint256[]) assetsToPrices1e18;
    string public constant FIAT_NAME = "EUR";

    function getFiatPrice1e18(address asset) override external view returns (uint) {
        uint256 len = assetsToPrices1e18[asset].length;
        require(len > 0, "MockOracle: asset isn't supported");
        return assetsToPrices1e18[asset][block.number % len];
    }

    function setFiatPrice1e18(address asset, uint256 price) public {
        assetsToPrices1e18[asset] = [price];
    }

    function setFiatPrice1e18Array(address asset, uint256[] memory prices) public {
        assetsToPrices1e18[asset] = prices;
    }
}
