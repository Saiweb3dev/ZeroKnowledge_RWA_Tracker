const { ethAddressToFieldArray } = require("../utils/addressToFieldUtils");
const { stringToFieldArray } = require("../utils/stringToFieldUtils");
const { getHash } = require("../utils/hashUtils");
const { compareData } = require("../utils/compareUtils");
const { getJsonData } = require("../utils/dataUtils");

async function processEthData(data) {
  const { address, id, inputString } = data;
  let finalResult = false;

  if (!address || !id || !inputString) {
    throw new Error("Missing required fields. Please provide address, id, and inputString.");
  }

  try {
    // step 1: Generate hash
    const hash = await getHash(address, id, inputString);
    console.log("Hash Done ✓");

    // step 2: Get json data using the address as key
    const jsonData = await getJsonData(address,id);
    if (!jsonData) {
      throw new Error("User Data Not found");
    }
    console.log("Json data Done ✓");

    const dbId = jsonData.tokenId;
    if (dbId !== id) {
      throw new Error("Id is not same in EthController");
    }

    // step 3 : Processing original input data
    const addressFields = ethAddressToFieldArray(address);
    const stringFields = stringToFieldArray(inputString);
    console.log("User req data Done ✓");

    // step 4 : Process Address & string from Json data
    const dbAddressFields = ethAddressToFieldArray(jsonData.address);
    const dbStringFields = stringToFieldArray(jsonData.key);
    console.log("DB req data Done ✓");

    // step 5 : Compare data
    const isAddressMatch = compareData(addressFields, dbAddressFields);
    const isStringMatch = compareData(stringFields, dbStringFields);

    if (isAddressMatch && isStringMatch) {
      finalResult = true;
    } else {
      throw new Error("Data is not same in EthController");
    }
    console.log("Comparing Done ✓");

    return {
      id,
      addressFields,
      stringFields,
      dbAddressFields,
      dbStringFields,
      dbId,
      finalResult,
    };
  } catch (error) {
    console.error("Error in processEthData:", error);
    throw error;
  }
}

module.exports = {
  processEthData,
};
