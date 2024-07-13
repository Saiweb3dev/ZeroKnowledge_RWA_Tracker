const { ethAddressToFieldArray } = require("../utils/addressToFieldUtils");
const { stringToFieldArray } = require("../utils/stringToFieldUtils");
const { getHash } = require("../utils/hashUtils");
const { compareData } = require("../utils/compareUtils");
const { getJsonData } = require("../utils/dataUtils");

async function processEthData(req, res) {
  const { address, id, inputString } = req.body;
  let finalResult = false;
  if (!address || !id || !inputString) {
    return res
      .status(400)
      .json({
        error:
          "Missing required fields. Please provide address, id, and inputString.",
      });
  }
  try {
    //step 1: Generate hash
    const hash = await getHash(address, id, inputString);
    console.log("Hash Done ✓");

    //step 2: Get json data using the address as key
    const jsonData = await getJsonData(address);
    if (!jsonData) {
      return res.status(404).json({ error: "User Data Not found" });
    }
    console.log("Json data Done ✓");

    //step 3 : Processing original input data
    const addressFields = ethAddressToFieldArray(address);
    const stringFields = stringToFieldArray(inputString);
    console.log("User req data Done ✓");

    //step 4 : Process Address & string from Json data
    const dbAddressFields = ethAddressToFieldArray(jsonData.address);
    const dbStringFields = stringToFieldArray(jsonData.inputString);
    console.log("DB req data Done ✓");

    //step 5 : Compare data
    const isAddressMatch = compareData(addressFields, dbAddressFields);
    const isStringMatch = compareData(stringFields, dbStringFields);

    if (isAddressMatch && isStringMatch) {
      finalResult = true;
    } else {
      return res
        .status(404)
        .json({ error: "Data is not same in EthController" });
    }
    console.log("Comparing Done ✓");
    const response = {
      id,
      addressFields,
      stringFields,
      dbAddressFields,
      dbStringFields,
      finalResult,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = {
  processEthData,
};
