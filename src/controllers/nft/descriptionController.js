const fs = require('fs').promises;
const path = require('path');

// Function to handle HTTP GET requests for fetching a specific asset description by ID
exports.getAssetDescription = async (req, res) => {
  // Construct the file path to the JSON file containing asset descriptions
  // This path is built relative to the current module's location (__dirname), navigating up two directories
  // and then into 'data' > 'assetData' > 'assetDescription.json'
  const ASSET_DATA_PATH = path.join(__dirname, '..', '..', 'data', 'assetData', 'assetDescription.json');

  try {
    // Asynchronously read the content of the asset description file using fs.readFile
    // The 'utf8' parameter specifies the encoding to use when reading the file, ensuring the content is treated as text
    const assetDescriptionRaw = await fs.readFile(ASSET_DATA_PATH, 'utf8');

    // Parse the raw JSON string into a JavaScript object to access its properties
    const assetDescriptions = JSON.parse(assetDescriptionRaw);

    // Retrieve the specific asset description based on the assetId provided in the request parameters
    // This assumes that the JSON structure is a dictionary/object where keys are assetIds and values are asset descriptions
    const assetDescription = assetDescriptions[req.params.assetId];

    // Send the retrieved asset description as a JSON response
    res.json(assetDescription);
  } catch (error) {
    // Log any errors encountered during file reading, parsing, or accessing the asset description
    console.error(`Error reading asset description from: ${ASSET_DATA_PATH}`, error);

    // Respond with a 500 Internal Server Error status and a message indicating failure to load the asset description
    res.status(500).json({ message: 'Failed to load asset description.' });
  }
};
