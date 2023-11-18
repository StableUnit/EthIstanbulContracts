// SPDX-License-Identifier: BSL 1.1
pragma solidity ^0.8.0;

// WARNING: Implementation is a mock, but the interface will be the same
interface ITopStakers {
    /* ===================== ERRORS ===================== */
    error StakerExist(address staker);
    error StakerNotExist(address staker);

    /* ==================== MUTABLE METHODS ==================== */

    function addTopStaker(address staker) external;

    function removeTopStaker(address staker) external;

    /* ==================== VIEW METHODS ==================== */

    function isTopStaker(address staker) external view returns(bool);
    function getTopStakersLength() external view returns(uint256);
}