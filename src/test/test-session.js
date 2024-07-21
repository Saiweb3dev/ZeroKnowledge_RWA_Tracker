const axios = require('axios');

// Replace 'your-session-id-here' with a valid session ID
const sessionId = '963bed754a181dbbb378c68603836d77';

axios.get(`http://localhost:8080/getData/${sessionId}`)
  .then(response => {
    console.log('API Response:', response.data);
  })
  .catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Response:', error.response.data);
      console.error('Error Status:', error.response.status);
      console.error('Error Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error Message:', error.message);
    }
    console.error('Error Config:', error.config);
  });

console.log('Test Script Complete.');
