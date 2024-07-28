// controllers/nftController.js

const { ethers } = require('ethers');
const nftMinterData = require('../../models/nftMinterData'); // Adjust the path as needed
const {  provider, contract, contractAddress, contractABI } = require('../../config/ethConfig.js'); // Import the shared config

exports.mintNFT = async (req, res) => {
  try {
    // Extract the request body data
    const data = req.body;
    const { address, signature } = data;

    console.log('Received address:', address);
console.log('Received signature:', signature);

    // Ensure the signature is a string and starts with '0x'
    if (typeof signature !== 'string' || !signature.startsWith('0x')) {
      return res.status(400).json({ success: false, error: 'Invalid signature format' });
    }

    // Verify the signature
    let signerAddress;
    try {
      signerAddress = ethers.verifyMessage('Mint NFT', signature);
    } catch (error) {
      console.error('Signature verification error:', error);
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }
    
  
    // Save the minter data using the saveMinterData function
    nftMinterData.saveMinterData(data);

    // Send a success response with the saved data and transaction hash
    res.status(200).json({ 
      message: 'Signature verified. Ready to mint.',
      contractAddress: contractAddress,
      contractABI: contractABI,
      data: data,
      tokenURI: "ipfs://your-token-uri" 
    });
  } catch (error) {
    // Log the error and send a failure response
    console.error('Error minting NFT:', error);
    res.status(500).json({ message: 'Failed to mint NFT and save minter data', error: error.message });
  }
};