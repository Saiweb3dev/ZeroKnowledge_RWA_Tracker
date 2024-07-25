// Import required modules
const fs = require('fs').promises; // File system promises API for async file operations
const path = require('path'); // Path utilities for handling file paths
const crypto = require('crypto'); // Cryptography functions for generating unique IDs

// Define constants for session and user key database paths
const SESSION_DATA_PATH = path.join(__dirname, '..', 'data', 'sessionDatabase');
const USER_KEY_DATABASE = path.join(__dirname, '..', 'data', 'userKeyDatabase.json');

/**
 * Ensures the session directory exists, creating it if necessary.
 */
async function ensureSessionDirectoryExists() {
  try {
    await fs.mkdir(SESSION_DATA_PATH, { recursive: true });
  } catch (error) {
    console.error('Error ensuring session directory exists:', error);
  }
}

// Call this function when your server starts to ensure the session directory exists
ensureSessionDirectoryExists();

/**
 * Generates a unique ID using cryptographic random bytes.
 */
function generateUniqueId() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Creates a new session with given user data, saving it to a file.
 * @param {Object} userData - User data to include in the session.
 */
async function createSession(userData) {
  const sessionId = generateUniqueId();
  const sessionData = {
    ...userData,
    timestamp: Date.now()
  };

  try {
    // Ensure the directory exists
    await fs.mkdir(SESSION_DATA_PATH, { recursive: true });

    const filePath = path.join(SESSION_DATA_PATH, `${sessionId}.json`);
    await fs.writeFile(filePath, JSON.stringify(sessionData));
    
    console.log(`Session file created: ${filePath}`);
    return sessionId;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Reads session data from a file.
 * @param {string} sessionId - Unique session ID.
 */
async function getSessionData(sessionId) {
  const sessionFilePath = path.join(SESSION_DATA_PATH, `${sessionId}.json`);
  console.log(`Attempting to read session data from: ${sessionFilePath}`);
  try {
    const sessionDataRaw = await fs.readFile(sessionFilePath, 'utf8');
    console.log(`Successfully read session data from: ${sessionFilePath}`);
    return JSON.parse(sessionDataRaw);
  } catch (error) {
    console.error(`Error reading session data from: ${sessionFilePath}`, error);
    throw error;
  }
}

/**
 * Deletes a session file by its ID.
 * @param {string} sessionId - Unique session ID.
 */
async function deleteSession(sessionId) {
  const sessionFilePath = path.join(SESSION_DATA_PATH, `${sessionId}.json`);
  await fs.unlink(sessionFilePath);
}

/**
 * Loads the user key database from a JSON file.
 */
async function loadUserKeyDatabase() {
  try {
    const rawData = await fs.readFile(USER_KEY_DATABASE, 'utf8');
    const parsedData = JSON.parse(rawData);
    return parsedData;
  } catch (error) {
    console.error('Error loading user key database:', error);
    return {};
  }
}

/**
 * Retrieves user data from the user key database.
 * @param {string} address - User address.
 * @param {string} id - User ID.
 */
async function getUserData(address, id) {
  const userKeyDatabase = await loadUserKeyDatabase();
  const userData = userKeyDatabase[address]?.[id];
  if (userData) {
    // Simulating decryption (replace with actual decryption logic)
    const decryptedData = Buffer.from(userData.encryptedData, 'base64').toString('utf-8');
    return decryptedData;
  }
  return null;
}

// Export the controller functions so they can be used elsewhere in the application
module.exports = {
  createSession,
  getSessionData,
  deleteSession,
  getUserData
};
