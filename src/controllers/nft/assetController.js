const fs = require('fs').promises;
const path = require('path');

// Function to handle HTTP GET requests for fetching asset data
exports.getAssetData = async (req, res) => {
  // Define the path to the JSON file containing asset data
  // The path.join method constructs a file path relative to the current module (__dirname),
  // navigating up two directories ('..', '..') and then into 'data' > 'assetData' > 'assetData.json'
  const ASSET_DATA_PATH = path.join(__dirname, '..', '..', 'data', 'assetData', 'assetData.json');

  try {
    // Asynchronously read the asset data file using fs.readFile
    // The 'utf8' parameter specifies the encoding to use when reading the file
    const assetDataRaw = await fs.readFile(ASSET_DATA_PATH, 'utf8');

    // Parse the raw JSON string into a JavaScript object
    const assetData = JSON.parse(assetDataRaw);

    // Send the parsed asset data as a JSON response
    res.json(assetData);
  } catch (error) {
    // Log any errors encountered during file reading or parsing
    console.error(`Error reading asset data from: ${ASSET_DATA_PATH}`, error);

    // Send a 500 Internal Server Error response with a message indicating failure to load asset data
    res.status(500).json({ message: 'Failed to load asset data.' });
  }
};
