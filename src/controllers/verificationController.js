// src/controllers/verificationController.js
const { verifyProof } = require('../utils/verifyProof');

const VERIFIER_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

const verifyZKProof = async (req, res) => {
  try {
    const result = await verifyProof(VERIFIER_ADDRESS);
    res.json({ verified: result });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed', details: error.message });
  }
};

module.exports = {
  verifyZKProof
};