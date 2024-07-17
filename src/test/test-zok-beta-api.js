const axios = require('axios');

// Assuming your server is running on localhost:3000
const API_URL = 'http://localhost:3000/api/run-zokrates-beta';

// Sample data - replace with your actual data
const data = {
  data1:123,
  data2:123
};

axios.post(API_URL, data)
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
  });