var PledgeFactory = artifacts.require("./PledgeFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(PledgeFactory);
};
