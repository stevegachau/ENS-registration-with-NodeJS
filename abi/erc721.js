module.exports = [
  "function owner(bytes32 node) public view returns (address)",
  "function maxCommitmentAge() view returns (uint256)",
  "function minCommitmentAge() view returns (uint256)",
  "function MIN_REGISTRATION_DURATION() view returns (uint256)",
  "function commit(bytes32)",
  "function makeCommitmentWithConfig(string name, address owner, bytes32 secret, address resolver, address addr) view returns (bytes32)",
  "function rentPrice(string name, uint256 duration) view returns (uint256)",
  "function registerWithConfig(string name, address owner, uint256 duration, bytes32 secret, address resolver, address addr) payable",
];