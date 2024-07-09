function ethAddressToFieldArray(address:string) {
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

// Example usage:
const reqAddress = "0xC2F20D5c81F5B4450aA9cE62638d0bB01DF1935a";
const orgAddress = "0xC2F20D5c81F5B4450aA9cE62638d0bB01DF1935a";
const reqAddressFields = ethAddressToFieldArray(reqAddress);
const orgAddressFields = ethAddressToFieldArray(orgAddress);
console.log(reqAddressFields);
console.log(orgAddressFields);