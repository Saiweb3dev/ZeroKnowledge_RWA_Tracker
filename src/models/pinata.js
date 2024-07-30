const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

/**
 * Pins JSON data to IPFS using the Pinata service.
 * 
 * @param {Object} jsonData - The JSON data to be pinned to IPFS.
 * @returns {Promise<string>} The IPFS hash of the pinned data.
 */
const pinJSONtoIPFS = async (jsonData) => {
  console.log("----------------- Started Pinata -----------------");
  
  // Retrieve JWT token from environment variables for authentication with Pinata API
  const JWT = process.env.PINATA_SECRET_JWT;
  
  // Define the URL for the Pinata API endpoint for pinning JSON to IPFS
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  
  // Construct the request body according to Pinata API requirements
  const requestBody = {
    pinataMetadata: { name: jsonData.name }, // Metadata about the content being pinned
    pinataContent: jsonData, // The actual JSON data to be pinned
  };
  
  console.log("Environment variables loaded:", !!process.env.PINATA_API_KEY, !!process.env.PINATA_SECRET_API_KEY);

  try {
    // Make a POST request to the Pinata API with the constructed request body
    const response = await axios.post(url, requestBody, {
      maxContentLength: Infinity, // Set maximum content length to infinity to handle large payloads
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
        pinata_api_key: process.env.PINATA_API_KEY, // Include the Pinata API key in the request headers
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY, // Include the Pinata secret API key in the request headers
        Authorization: `Bearer ${JWT}`, // Include the JWT token for authentication
      },
    });
    
    console.log(response.data); // Log the response data for debugging purposes
    return response.data.IpfsHash; // Return the IPFS hash of the pinned data
  } catch (error) {
    console.error('Error pinning JSON to IPFS:', error.response ? error.response.data : error.message); // Log any errors encountered during the request
    throw error; // Rethrow the error to be handled by the caller
  }
};

module.exports = { pinJSONtoIPFS }; // Export the function for use in other modules
