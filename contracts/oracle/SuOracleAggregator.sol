// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

/*
    OracleAggregator aggregates several oracles inside, such as: getUsdPrice asset -> id -> call to implementation
    We have several oracle implementations of ISuOracle (they are inside this folder)
*/

import "../access-control/SuAuthenticated.sol";
import "../interfaces/oracle/ISuOracleAggregator.sol";

/**
 * @title SuChainlinkOracle
 * @notice Oracle that aggregate all oracles, like router
 * @dev See ISuOracleAggregator interface for full details.
 */
contract SuOracleAggregator is ISuOracleAggregator, SuAuthenticated {
    mapping (address => uint256) public assetToOracle;
    mapping (uint256 => ISuOracle) public oracleImplementations;

    function initialize(address _authControl) public initializer {
        __suAuthenticatedInit(_authControl);
    }

    function getFiatPrice1e18(address asset) external view returns (uint256) {
        uint256 oracleId = assetToOracle[asset];
        if (oracleId == 0) revert NoOracleFound(asset);
        ISuOracle oracleImplementation = oracleImplementations[oracleId];
        if (address(oracleImplementation) == address(0)) revert NoOracleImplementation();
        return oracleImplementation.getFiatPrice1e18(asset);
    }

    function setOracleImplementation(uint256 oracleId, ISuOracle oracleImplementation) external onlyDAO {
        if (oracleId == 0) revert BadOracleId();
        if (address(oracleImplementation) == address(0)) revert NoOracleImplementation();
        oracleImplementations[oracleId] = oracleImplementation;
    }

    function setOracleIdForAssets(address[] memory assets, uint256 oracleId) external onlyDAO {
        if (address(oracleImplementations[oracleId]) == address(0)) revert NoOracleImplementation();
        for (uint256 i = 0; i < assets.length; ++i) {
            assetToOracle[assets[i]] = oracleId;
        }
    }
}
