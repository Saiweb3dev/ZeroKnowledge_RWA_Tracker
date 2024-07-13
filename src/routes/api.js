// src/routes/api.js
const express = require('express');
const router = express.Router();
const ethController = require('../controllers/ethController');

router.post('/process-eth-data', ethController.processEthData);

module.exports = router;