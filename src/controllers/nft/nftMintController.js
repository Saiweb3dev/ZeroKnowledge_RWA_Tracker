// controllers/nftController.js

const { ethers } = require('ethers');
const nftMinterData = require('../../models/nftMinterData');
const { contractAddress, contractABI } = require('../../config/ethConfig.js');
const { pinJSONtoIPFS } = require('../../models/pinata.js');

exports.mintNFT = async (req, res) => {
  try {
    const { address, signature } = req.body;

    const data = req.body;

    console.log('Received address:', address);
    console.log('Received signature:', signature);

    if (typeof signature !== 'string' || !signature.startsWith('0x')) {
      return res.status(400).json({ success: false, error: 'Invalid signature format' });
    }

    let signerAddress;
    try {
      signerAddress = ethers.verifyMessage('Mint NFT', signature);
      if (signerAddress.toLowerCase() !== address.toLowerCase()) {
        return res.status(400).json({ success: false, error: 'Signature does not match the provided address' });
      }
    } catch (error) {
      console.error('Signature verification error:', error);
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    console.log("----------------- Calling Pinata -----------------");
    const ipfsResponse = await pinJSONtoIPFS(data);
    if (!ipfsResponse) {
      return res.status(500).json({ success: false, error: 'Failed to pin data to IPFS' });
    }
    console.log("IPFS Response ----->", ipfsResponse);

    const tokenURI = `ipfs://${ipfsResponse}`;

    res.status(200).json({ 
      success: true,
      message: 'Signature verified. Ready to mint.',
      contractAddress: contractAddress,
      contractABI: contractABI,
      tokenURI: tokenURI,
      // txHash: receipt.transactionHash // Uncomment if actually minting
    });
  } catch (error) {
    console.error('Error in mintNFT:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process NFT minting', 
      error: error.message 
    });
  }
};

exports.saveMintData = async (req, res) => {
  try{
    console.log("Saving Mint Data");
    const data = req.body;

    await nftMinterData.saveMinterData(data);
    res.status(200).json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error in saveMintData:', error);
    res.status(500).json({ success: false, message: 'Failed to save data', error: error.message });
  }
  }