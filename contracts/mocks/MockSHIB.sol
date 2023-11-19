// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockSHIB is ERC20 {
    constructor() ERC20("test SHIBA INU", "SHIB") {}

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
