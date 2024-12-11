const fs = require("fs");
const md5 = require("md5");

const SECRET_KEY = fs.readFileSync('inputs/day04.txt', 'utf8');

// Pt. 1
const LEADING_ZEROS = "00000";
// Pt. 2
// const LEADING_ZEROS = "000000";

let num = 0;

while(true) {
  if (md5(SECRET_KEY + num).startsWith(LEADING_ZEROS)) {
    break;
  }
  num++;
}

console.log(`Answer: ${num}`);

