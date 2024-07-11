// src/routes/api.js
const express = require('express');
const router = express.Router();

// Test route
router.post('/process', (req, res) => {
  const { data } = req.body;
  
  if (!data || typeof data !== 'string') {
    return res.status(400).json({ error: 'Invalid input. Please provide a string in the "data" field.' });
  }

  // Example processing function
  const processString = (str) => str.length;

  const result = processString(data);
  res.json({ result });
});

module.exports = router;