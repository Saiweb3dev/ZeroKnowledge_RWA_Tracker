// Import required modules and controllers
const express = require("express");
const router = express.Router();
const ethController = require("../controllers/ethController");
const zokratesController = require("../controllers/zokratesController");
const verificationController = require("../controllers/verificationController");
const sessionController = require("../controllers/sessionController");

// POST /verify endpoint to verify Ethereum data using Zokrates
router.post("/verify", async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    // Process Ethereum data
    const ethData = await ethController.processEthData(req.body);
    console.log("Ethereum data processed:", ethData);

    // Run Zokrates verification on processed data
    const zokratesResult = await zokratesController.runZokrates(ethData);
    console.log("Zokrates result:", zokratesResult);

    // Check if verification passed
    if (
      zokratesResult.verifyOutput &&
      zokratesResult.verifyOutput.includes("PASSED")
    ) {
      // Create a new session upon successful verification
      const sessionId = await sessionController.createSession(req.body);
      console.log('Created session with ID:', sessionId);

      // Respond with session ID and verification details
      res.json({
        sessionId,
        message: "Verification passed successfully",
        zokratesVerification: zokratesResult.verifyOutput,
      });
    } else {
      // Respond with error if verification failed
      res.status(400).json({
        error: "Verification failed",
        zokratesVerification:
          zokratesResult.verifyOutput || "Verification output not available",
      });
    }
  } catch (error) {
    console.error("Error in verification:", error);
    // Send appropriate HTTP status code and error message
    res
      .status(500)
      .json({
        error: error.message || "An error occurred during verification",
      });
  }
});

// GET /getData/:sessionId endpoint to retrieve session data
router.get(`/getData/:sessionId`, async (req, res) => {
  console.log("GetData API called");
  try {
    // Extract session ID from request parameters
    const { sessionId } = req.params;
    // Retrieve session data
    const sessionData = await sessionController.getSessionData(sessionId);

    // Handle case where session data not found
    if (!sessionData) {
      console.log('Session data not found for sessionId:', sessionId);
      return res.status(404).json({ error: "Session not found" });
    }
    console.log('Session data retrieved:', sessionData);

    // Check if session has expired
    if (Date.now() - sessionData.timestamp > 3600000) {
      // Delete expired session
      await sessionController.deleteSession(sessionId);
      res.status(404).json({ error: "Session expired" });
    }

    // Extract necessary data from session
    const { address, id, inputString } = sessionData;

    // Retrieve user data using session data
    const userData = await sessionController.getUserData(address, id);

    // Respond with user data if found
    if (userData) {
      console.log("Using inputString as key:", inputString);
      res.json({ data: userData });
    } else {
      // Respond with error if user data not found
      res.status(404).json({ error: "User data not found" });
    }
  } catch (error) {
    console.error("Error in getData:", error);
    // Handle errors appropriately
    if (error.code === "ENOENT") {
      res.status(404).json({ error: "Session not found" });
    } else {
      res
        .status(500)
        .json({
          error: error.message || "An error occurred while retrieving data",
        });
    }
  }
});

// POST /verify-proof endpoint to verify zero-knowledge proof
router.post("/verify-proof", verificationController.verifyZKProof);

// Export the router for use in the application
module.exports = router;
