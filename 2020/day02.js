const { getInput } = require('../utils');

let input = getInput('day02.txt').split('\n');

let valid = 0;

for (let line of input) {
  let parts = line.split(":");
  let requirement = parts[0];
  let reqParts = requirement.split(" ");
  let letter = reqParts[1];
  let nums = reqParts[0];
  let numParts = nums.split("-");
  let min = parseInt(numParts[0]);
  let max = parseInt(numParts[1]);
  let password = parts[1].trim();

  // PART 1
  // let total = 0;
  // for (let char of password) {
  //     if (char === letter) {
  //         total++;
  //     }
  // }
  // if (total >= min && total <= max) {
  //     valid++
  // }

  // PART 2
  let index1 = min - 1;
  let index2 = max - 1;
  let total = 0;
  if (password[index1] === letter) {
    total++;
  }
  if (password[index2] === letter) {
    total++;
  }
  if (total === 1) {
    valid++;
  }
}
console.log(`Answer: ${valid}`);
