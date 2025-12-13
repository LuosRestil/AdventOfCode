import fs from 'fs';

let input = fs.readFileSync('inputs/day01.txt', 'utf8');

// PT. 1

let floor = 0;

for (let char of input) {
  if (char === "(") {
    floor++;
  } else if (char === ")") {
    floor--;
  }
}

console.log(`Answer: ${floor}`);

// PT. 2

floor = 0;

for (let i = 0; i < input.length; i++) {
  if (input[i] === "(") {
    floor++;
  } else if (input[i] === ")") {
    floor--;
  }
  if (floor === -1) {
    console.log(`Answer: ${i + 1}`);
    break;
  }
}
