const fs = require('fs');
const path = require('path');

function loadContractData(contractName) {
  const deploymentPath = path.join(__dirname, '..', 'deployments', 'localhost', `${contractName}.json`);
  const rawdata = fs.readFileSync(deploymentPath);
  const contractData = JSON.parse(rawdata);
  return {
    address: contractData.address,
    abi: contractData.abi
  };
}