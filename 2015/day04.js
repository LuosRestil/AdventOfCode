import fs from 'fs';
import md5 from 'md5';

const SECRET_KEY = fs.readFileSync('inputs/day04.txt', 'utf8');

console.log(`Part 1: ${run("00000")}`);
console.log(`Part 2: ${run("000000")}`);

function run(leadingZeros) {
  let num = 0;
  while(true) {
    if (md5(SECRET_KEY + num).startsWith(leadingZeros)) {
      break;
    }
    num++;
  }
  return num;
}

