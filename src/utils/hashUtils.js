const crypto = require('crypto');

async function getHash(address, id, inputString) {
    const data = `${address}-${id}-${inputString}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports = { getHash };