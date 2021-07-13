//
// A decentralised registry of 4-bytes signatures => method mappings
//
//SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SignatureReg is Ownable {
  // mapping of signatures to entries
  mapping (bytes4 => string) public entries;

  // the total count of registered signatures
  uint public totalSignatures = 0;

  // allow only new calls to go in
  modifier onlyUnregistered(bytes4 _signature) {
    if (bytes(entries[_signature]).length != 0) return;
    _;
  }

  // dispatched when a new signature is registered
  event Registered(address indexed creator, bytes4 indexed signature, string method);

  // constructor with self-registration
  constructor() {
    register('register(string)');
  }

  // registers a method mapping
  function register(string memory _method) public returns (bool) {
    return _register(bytes4(keccak256(abi.encodePacked(_method))), _method);
  }

  // internal register function, signature => method
  function _register(bytes4 _signature, string memory _method) internal onlyUnregistered(_signature) returns (bool) {
    entries[_signature] = _method;
    totalSignatures = totalSignatures + 1;
    emit Registered(msg.sender, _signature, _method);
    return true;
  }

  // in the case of any extra funds
  function drain() onlyOwner public {
    if (!msg.sender.send(address(this).balance)) {
      revert();
    }
  }
}
