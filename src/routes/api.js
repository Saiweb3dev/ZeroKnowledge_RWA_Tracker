// src/routes/api.js
const express = require('express');
const router = express.Router();
const ethController = require('../controllers/ethController');
const zokratesController = require('../controllers/zokratesController');
const verificationController = require('../controllers/verificationController');


router.post('/process-and-verify', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    
    const ethData = await ethController.processEthData(req.body);
    console.log('Ethereum data processed:', ethData);
    
    const zokratesResult = await zokratesController.runZokrates(ethData);
    console.log('Zokrates result:', zokratesResult);

    const finalResponse = {
      ethProcessingResult: ethData,
      zokProcessingResult: zokratesResult
    };

    res.json(finalResponse);
  } catch (error) {
    console.error('Error in combined processing:', error);
    res.status(500).json({ error: error.message || 'An error occurred during processing' });
  }
});
router.post('/verify-proof',verificationController.verifyZKProof)

module.exports = router;