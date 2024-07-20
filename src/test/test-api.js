// test.js
const axios = require('axios');

const baseURL = 'http://localhost:3000/api';

async function testProcessEthData() {
  try {
    const response = await axios.post(`${baseURL}/process-and-verify`, {
      address: '0xC2F20D5c81F5B4450aA9cE62638d0bB01DF1935a',
      id: '123',
      inputString: 'Hell'
    });
    console.log('Success Response:', response.data);
  } catch (error) {
    handleError(error);
  }
}

function handleError(error) {
  if (error.response) {
    console.log("Error from test-api.js:");
    console.log('Error data:', error.response.data);
    console.log('Error status:', error.response.status);
  } else if (error.request) {
    console.log('Error request:', error.request);
  } else {
    console.log('Error message:', error.message);
  }
}
;

testProcessEthData()
