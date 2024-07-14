// src/routes/api.js
const express = require('express');
const router = express.Router();
const ethController = require('../controllers/ethController');
const zokratesController = require('../controllers/zokratesController');

router.post('/process-eth-data', ethController.processEthData);
router.post('/run-zokrates', zokratesController.runZokrates)
module.exports = router;