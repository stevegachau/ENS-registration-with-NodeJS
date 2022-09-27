const ethers = require("ethers");

const getReabableEtherNumber = (balance) => {
  return ethers.utils.formatEther(balance);
};

module.exports = {
  getReabableEtherNumber,
};
