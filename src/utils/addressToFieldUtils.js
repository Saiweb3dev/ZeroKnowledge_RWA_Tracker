function ethAddressToFieldArray(address) {
  if (address.length !== 42 || address.slice(0, 2) !== '0x') {
      throw new Error('Invalid Ethereum address format');
  }
  address = address.slice(2);
  let fieldArray = [];
  for (let i = 0; i < address.length; i += 2) {
      fieldArray.push(parseInt(address.slice(i, i + 2), 16));
  }
  return fieldArray;
}

module.exports = { ethAddressToFieldArray };