const axios = require('axios');

// The URL of your server
const API_URL = 'http://localhost:3000/api/verify-proof';

async function testVerificationAPI() {
  try {
    console.log('Sending verification request...');
    const response = await axios.post(API_URL);
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    if (response.data.verified === true) {
      console.log('Proof verified successfully!');
    } else {
      console.log('Proof verification failed.');
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testVerificationAPI();