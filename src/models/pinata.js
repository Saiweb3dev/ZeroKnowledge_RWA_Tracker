const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config(); // Ensure dotenv is called correctly

const pinJSONtoIPFS = async (jsonData) => {
  console.log("----------------- Started Pinata -----------------");
  const JWT = process.env.PINATA_SECRET_JWT
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  const formData = new FormData();
  formData.append('pinataMetadata', JSON.stringify({ name: jsonData.name }));
  formData.append('pinataContent', JSON.stringify(jsonData));
  
  console.log("Environment variables loaded:", !!process.env.PINATA_API_KEY, !!process.env.PINATA_SECRET_API_KEY);

  try {
    const response = await axios.post(url, formData, {
      maxContentLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        Authorization: `Bearer ${JWT}`, // Only include if necessary and correct
      },
    });
    
    console.log(response.data);
    return response.data.IpfsHash; // Assuming you want to return the IPFS hash
  } catch (error) {
    console.error('Error pinning JSON to IPFS:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { pinJSONtoIPFS };
