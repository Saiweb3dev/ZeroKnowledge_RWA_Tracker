const fs = require('fs').promises;
const path = require('path');

async function getJsonData(address,id) {
    const filePath = path.join(__dirname, '..', 'data','minterDatabase', `${address}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    const userData = JSON.parse(data);
    console.log(`User Data Received for the address ${address} and id ${id} --->`, userData[id]);
    return userData[id] || null;
}

module.exports = { getJsonData };