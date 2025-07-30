// 2_deploy_voting_system.js
    
const VotingSystem = artifacts.require("VotingSystem");
    
module.exports = function(deployer) {
  deployer.deploy(VotingSystem);
};