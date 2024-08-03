const {ethers} = require('ethers')
const contractData = require('../../deployments/hardhat/RWA_Tokenizer.json');
const contractABI = contractData.abi;
const contractAddress = contractData.address;

// Connect to local Hardhat network
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider)

module.exports = {
  provider,
  contract,
  contractAddress,
  contractABI
};