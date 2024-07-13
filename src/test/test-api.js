// test.js
const axios = require('axios');

const baseURL = 'http://localhost:3000/api';

async function testProcessEthData() {
  try {
    const response = await axios.post(`${baseURL}/process-eth-data`, {
      address: '0xC2F20D5c81F5B4450aA9cE62638d0bB01DF1935a',
      id: 'testId123',
      inputString: 'Hello, Ethereum!'
    });
    console.log('Success Response:', response.data);
  } catch (error) {
    handleError(error);
  }
}

// async function testMissingFields() {
//   try {
//     const response = await axios.post(`${baseURL}/process-eth-data`, {
//       address: '0xC2F20D5c81F5B4450aA9cE62638d0bB01DF1935a',
//       // missing id and inputString
//     });
//   } catch (error) {
//     handleError(error);
//   }
// }

// async function testInvalidAddress() {
//   try {
//     const response = await axios.post(`${baseURL}/process-eth-data`, {
//       address: 'invalidAddress',
//       id: 'testId123',
//       inputString: 'Hello, Ethereum!'
//     });
//   } catch (error) {
//     handleError(error);
//   }
// }

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

// async function runTests() {
//   console.log('Testing process-eth-data with valid input:');
//   await testProcessEthData();
  
//   console.log('\nTesting process-eth-data with missing fields:');
//   await testMissingFields();
  
//   console.log('\nTesting process-eth-data with invalid address:');
//   await testInvalidAddress();
// }
testProcessEthData()
// runTests();