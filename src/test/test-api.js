const axios = require('axios');

axios.post('http://localhost:3000/api/process', {
  data: 'test string'
})
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.log(error);
});