// src/utils/verifyProof.js
const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

const proofPath = path.join(__dirname, '..', 'proof.json');
const verifierABI = [
  {
    "type": "function",
    "name": "verifyTx",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "tuple",
        "name": "proof",
        "components": [
          {
            "type": "tuple",
            "name": "a",
            "components": [
              {
                "type": "uint256",
                "name": "X"
              },
              {
                "type": "uint256",
                "name": "Y"
              }
            ]
          },
          {
            "type": "tuple",
            "name": "b",
            "components": [
              {
                "type": "uint256[2]",
                "name": "X"
              },
              {
                "type": "uint256[2]",
                "name": "Y"
              }
            ]
          },
          {
            "type": "tuple",
            "name": "c",
            "components": [
              {
                "type": "uint256",
                "name": "X"
              },
              {
                "type": "uint256",
                "name": "Y"
              }
            ]
          }
        ]
      },
      {
        "type": "uint256[45]",
        "name": "input"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": "r"
      }
    ]
  }
]; 

async function verifyProof(verifierAddress) {
  const proofJson = JSON.parse(fs.readFileSync(proofPath, 'utf-8'));
  const { proof, inputs } = proofJson;
  const a = proof.a;
  const b = proof.b[0].map((item, i) => [item, proof.b[1][i]]);
  const c = proof.c;

  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  const verifierContract = new ethers.Contract(verifierAddress, verifierABI, provider);

  try {
    const result = await verifierContract.verifyTx([a, b, c], inputs);
    return result;
  } catch (error) {
    console.error('Verification failed:', error);
    throw error;
  }
}

module.exports = { verifyProof };