function compareData(array1, array2) {
  // Check if the lengths of the arrays are equal
  if (array1.length !== array2.length) {
    return false;
  }

  // Iterate through each element in the arrays
  for (let i = 0; i < array1.length; i++) {
    // Compare each pair of elements
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
}

module.exports = { compareData };