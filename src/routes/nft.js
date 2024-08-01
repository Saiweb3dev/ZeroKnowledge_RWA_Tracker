// Import necessary modules
const express = require('express');
const router = express.Router();
// Import controllers for handling NFT assets and descriptions
const assetController = require("../controllers/nft/assetController");
const descriptionController = require("../controllers/nft/descriptionController");
const nftController = require('../controllers/nft/nftMintController');



// Define route for fetching general asset data
// This route responds with JSON data containing information about various NFT assets
router.get('/getAssetData', assetController.getAssetData);

// Define route for fetching a specific asset's description by its ID
// The :assetId in the route is a parameter that allows clients to specify which asset's description they want to retrieve
router.get('/getAssetDescription/:assetId', descriptionController.getAssetDescription);

router.post('/mintNFT', nftController.mintNFT);

router.post('/updateMintingData',nftController.saveMintData)


// Export the configured router so it can be used by the main server file
module.exports = router;
