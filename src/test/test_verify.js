const fs = require('fs');
const path = require('path');
const ethers = require('ethers');

async function main() {
    // Construct the path to proof.json
    const proofPath = path.join(__dirname, '..', 'proof.json');

    // Read and parse the proof.json file
    const proofJson = JSON.parse(fs.readFileSync(proofPath, 'utf8'));

    // console.log("Json data received is -> ",proofJson)
    console.log("Json data test c -> ",proofJson.proof.c)

    // Restructure the proof to match the expected format, ensuring hex values are formatted correctly
    const proof = {
        a: {
            X: proofJson.proof.a[0],
            Y: proofJson.proof.a[1]
        },
        b: {
            X: [
              proofJson.proof.b[0][0],
              proofJson.proof.b[0][1]
            ],
            Y: [
              proofJson.proof.b[1][0],
              proofJson.proof.b[1][1]
            ]
        },
        c: {
            X: proofJson.proof.c[0],
            Y:proofJson.proof.c[1]
        }
    };

    // console.log("Proof sent -> ",proof)

    // Use the inputs from the proof.json file
    const input =  "0x000000000000000000000000000000000000000000000000000000000000007b";

    // Connect to the local Hardhat network
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");

    // Contract address
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Contract ABI (same as before)
    const contractABI = [
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
                  "type": "uint256[1]",
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

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    console.log("Proof:", JSON.stringify(proof, null, 2));
    console.log("Real Proof:", proof);
    console.log("Input:", input);
    
    try {
        const result = await contract.verifyTx(proof, input);
        console.log("Verification result:", result);
    } catch (error) {
        console.error("Error calling verifyTx:", error);
        // Log more details about the error
        if (error.reason) console.error("Reason:", error.reason);
        if (error.data) console.error("Data:", error.data);
    }
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
