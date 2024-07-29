// controllers/nftController.js

const { ethers } = require('ethers');
const nftMinterData = require('../../models/nftMinterData');
const { contractAddress, contractABI } = require('../../config/ethConfig.js');
const { pinJSONtoIPFS } = require('../../models/pinata.js');

exports.mintNFT = async (req, res) => {
  try {
    const { address, signature, ...otherData } = req.body;

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
    const ipfsResponse = await pinJSONtoIPFS(otherData);
    if (!ipfsResponse) {
      return res.status(500).json({ success: false, error: 'Failed to pin data to IPFS' });
    }
    console.log("IPFS Response ----->", ipfsResponse);

    const tokenURI = `ipfs://${ipfsResponse}`;

    // Save the minter data
    await nftMinterData.saveMinterData({ address, ...otherData });

    // Here, you would typically interact with your smart contract to actually mint the NFT
    // For example:
    // const provider = new ethers.providers.JsonRpcProvider(YOUR_RPC_URL);
    // const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    // const contract = new ethers.Contract(contractAddress, contractABI, signer);
    // const tx = await contract.mintNFT(address, tokenURI);
    // const receipt = await tx.wait();

    res.status(200).json({ 
      success: true,
      message: 'NFT minting prepared successfully',
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