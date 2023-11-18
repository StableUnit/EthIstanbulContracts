// SPDX-License-Identifier: BSL 1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";

import "../interfaces/ITopStakers.sol";
import "../../access-control/SuAuthenticated.sol";

// TODO: It's Mock, only for test usage
/**
 * @notice Real TopStaker in polygon/mainnet will be different, but with the same interface
**/
contract TopStakers is SuAuthenticated, ITopStakers {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

    // move to another contract
    EnumerableSetUpgradeable.AddressSet private topStakers;

    function initialize(address _authControl) public initializer {
        __suAuthenticatedInit(_authControl);
    }

    function addTopStaker(address staker) public onlyAdmin {
        if (isTopStaker(staker)) revert StakerExist(staker);
        EnumerableSetUpgradeable.add(topStakers, staker);
    }

    function removeTopStaker(address staker) public onlyAdmin {
        if (!isTopStaker(staker)) revert StakerNotExist(staker);
        EnumerableSetUpgradeable.remove(topStakers, staker);
    }

    function isTopStaker(address staker) public view returns(bool) {
        return EnumerableSetUpgradeable.contains(topStakers, staker);
    }

    function getTopStakersLength() public view returns(uint256) {
        return EnumerableSetUpgradeable.length(topStakers);
    }
}
