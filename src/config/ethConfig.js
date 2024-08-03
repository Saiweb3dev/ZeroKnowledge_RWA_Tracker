const {ethers} = require('ethers')
const contractData = require('../../deployments/hardhat/RWA_Tokenizer.json');
import { JsonRpcProvider } from 'ethers';
const contractABI = contractData.abi;
const contractAddress = contractData.address;
const SEPOLIA_RPC_URL ="https://eth-sepolia.g.alchemy.com/v2/8cAuHYtk5pZaV5S4z9QKIKLbAj3JEc3i";
// Connect to local Hardhat network
const provider = new JsonRpcProvider(SEPOLIA_RPC_URL);

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider)

module.exports = {
  provider,
  contract,
  contractAddress,
  contractABI
};