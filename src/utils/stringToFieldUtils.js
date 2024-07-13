function stringToFieldArray(str) {
  return str.split('').map(char => char.charCodeAt(0));
}

module.exports = { stringToFieldArray };