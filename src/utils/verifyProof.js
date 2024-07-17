const ethers = require('ethers');

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

async function verifyProof(verifierAddress) {
  const proof = {
    a: ["0x2636edb2e29c3a5efcf2a7f1659176749bbc9fa1ff456d3095221818b45a9a4f", "0x01999e02f2d148f7beecd1f1eb4b88e66571c87a35870837db158dbe68fa1053"],
    b: [
      ["0x162ea4ca1c6bcaea4c6bb996133f49ba2a1ddbfc71ce015ab404c3c38d8fcfb9", "0x04dccd67673c480a8afa75d5477c62ada6841ed44b46e1c0fdb9462c44a89080"],
      ["0x27c5b7efeeff3ba6f933bb3c8bacc5f40dd09f6e8e24e481938b042509803317", "0x2eb62d6bd6f36fac129c58018f565be4af6fb6a63f4cf67284531af2a77c63b1"]
    ],
    c: ["0x098f832253131ed6544bf2a0ba95b9140c56021e4eca427fdef61828a10438c9", "0x1209485ea63ab1de34226efad43a8aadc9de3f7739cdaa958765a892604ef921"]
  };

  let inputs;
  try {
    if (ethers.BigNumber) {
      inputs = [ethers.BigNumber.from("0x0000000000000000000000000000000000000000000000000000000000000001")];
    } else if (ethers.utils && ethers.utils.BigNumber) {
      inputs = [ethers.utils.BigNumber.from("0x0000000000000000000000000000000000000000000000000000000000000001")];
    } else {
      inputs = [BigInt("0x0000000000000000000000000000000000000000000000000000000000000001")];
    }
  } catch (error) {
    console.error("Error creating inputs:", error);
    throw error;
  }

  try {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const signer = new ethers.Wallet(privateKey, provider);
    const verifierContract = new ethers.Contract(verifierAddress, verifierABI, signer);

    function hexToBigNumber(hexString) {
      try {
        if (ethers.BigNumber) {
          return ethers.BigNumber.from(hexString);
        } else if (ethers.utils && ethers.utils.BigNumber) {
          return ethers.utils.BigNumber.from(hexString);
        } else {
          return BigInt(hexString);
        }
      } catch (error) {
        console.error("Error converting hex string to BigNumber:", error);
        throw error;
      }
    }

    const transformedProof = {
      a: [hexToBigNumber(proof.a[0]), hexToBigNumber(proof.a[1])],
      b: proof.b.map(pair => pair.map(hexToBigNumber)),
      c: [hexToBigNumber(proof.c[0]), hexToBigNumber(proof.c[1])]
    };

    const txParams = {
      proof: transformedProof,
      input: inputs
    };

    const result = await verifierContract.verifyTx(txParams, {
      gasLimit: 3000000
    });

    console.log("Verification result:", result);
    return result;
  } catch (error) {
    console.error('Verification failed:', error);
    throw error;
  }
}

async function main() {
  const verifierAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  try {
    await verifyProof(verifierAddress);
  } catch (error) {
    console.error('Error in main:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = { verifyProof };
