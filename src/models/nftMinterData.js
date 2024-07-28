const fs = require('fs');
const path = require('path');

// Define the path to the session data directory
const MINTER_DATA_PATH = path.join(__dirname,'..', 'data', 'minterDatabase');



function saveMinterData(data) {
  // Get the current date and time
  const currentDate = new Date();

  // Format the current date and time into a more readable string
  // Note: The formatting options are adjusted to match the desired output
  const formattedDateTime = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short' // Optional: Include timezone abbreviation
  });

  // Combine the original data with the formatted date/time under a new 'timestamp' key
  const minterData = {
    ...data,
    timestamp: formattedDateTime,
  };
  const fileName = `${minterData.name}.json`;
  const filePath = path.join(MINTER_DATA_PATH, fileName);

  // Corrected: Check if the directory exists, if not, create it
  if (!fs.existsSync(MINTER_DATA_PATH)) {
    fs.mkdirSync(MINTER_DATA_PATH, { recursive: true });
  }

  // Attempt to write the minter data to the file
  try {
    fs.writeFileSync(filePath, JSON.stringify(minterData, null, 2));
    console.log(`Minter data saved to ${filePath}`);
  } catch (error) {
    console.error(`Failed to save minter data to ${filePath}:`, error);
    throw error; // Rethrow the error to allow further handling if necessary
  }
}

module.exports = {
  saveMinterData
};
