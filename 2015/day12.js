import fs from 'fs';

let input = JSON.parse(fs.readFileSync('inputs/day12.json', 'utf8'));

let total = getValuesFromObject(input);

console.log(`Answer: ${total}`);

function getValuesFromObject(object, excludeRed = true) {
  if (excludeRed && !Array.isArray(object)) {
    if (Object.values(object).includes("red")) {
      return 0;
    }
  }
  let total = 0;
  if (!Array.isArray(object)) {
    object = Object.values(object)
  }
  for (let value of object) {
    if (typeof value === 'object') {
      total += getValuesFromObject(value);
    } else if (typeof value === 'number') {
      total += value;
    }
  }
  return total;
}

// Pt. 1, getValuesFromObject, excludeRed = false
// Pt. 2, getValuesFromObject, excludeRed = true