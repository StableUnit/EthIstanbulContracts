// SPDX-License-Identifier: BSL 1.1

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "../interfaces/access-control/ISuAccessControl.sol";
import "./SuAccessRoles.sol";

pragma solidity ^0.8.0;

/**
 * @title SuAccessControl
 * @dev Access control for contracts. SuVaultParameters can be inherited from it.
 * see hierarchy in SuAccessRoles.sol
 */
contract SuAccessControlSingleton is AccessControlUpgradeable, SuAccessRoles, ISuAccessControl {
    /**
     * @dev Initialize the contract with initial owner to be deployer
     */
    function initialize(address dao) public initializer {
        __AccessControl_init();

        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(DAO_ROLE, dao);

        // Now we set hierarchy - what roles can give/revoke other roles
        _setRoleAdmin(DAO_ROLE, DAO_ROLE);

        // Only DAO role can set Admin and System roles
        _setRoleAdmin(ADMIN_ROLE, DAO_ROLE);

        // Only DAO role can set System roles
        _setRoleAdmin(MINT_ACCESS_ROLE, DAO_ROLE);
        _setRoleAdmin(VAULT_ACCESS_ROLE, DAO_ROLE);
        _setRoleAdmin(LIQUIDATION_ACCESS_ROLE, DAO_ROLE);
        _setRoleAdmin(REWARD_ACCESS_ROLE, DAO_ROLE);

        // Only Admin role can set Alerter role
        _setRoleAdmin(ALERTER_ROLE, ADMIN_ROLE);
    }

    function setRoleAdmin(bytes32 role, bytes32 adminRole) public onlyRole(DAO_ROLE) {
        _setRoleAdmin(role, adminRole);
    }
}
