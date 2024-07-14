// src/routes/api.js
const express = require('express');
const router = express.Router();
const ethController = require('../controllers/ethController');
const zokratesController = require('../controllers/zokratesController');
const verificationController = require('../controllers/verificationController');
router.post('/process-eth-data', ethController.processEthData);
router.post('/run-zokrates', zokratesController.runZokrates)
router.post('/verify-proof',verificationController.verifyZKProof)
module.exports = router;