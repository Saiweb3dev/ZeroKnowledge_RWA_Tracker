const fs = require('fs').promises;
const path = require('path');

async function getJsonData(hash) {
    const filePath = path.join(__dirname, '..', 'data', 'userData.json');
    const data = await fs.readFile(filePath, 'utf8');
    const userData = JSON.parse(data);
    return userData[hash] || null;
}

module.exports = { getJsonData };