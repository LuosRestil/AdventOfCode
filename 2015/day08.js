const fs = require("fs");

let input = fs.readFileSync('inputs/day08.txt', 'utf8');
input = input.split("\n");

let codeChars = 0;
let memChars = 0;
let newLen = 0;

for (let line of input) {
  codeChars += line.length;
  newLen += 4;
  for (let i = 1; i < line.length - 1; i++) {
    memChars++;
    if (line[i] === "\\") {
      newLen += 2;
      i++;
      if (line[i] === "x") {
        newLen--;
        i += 2;
      }
    }
  }
}

newLen += codeChars;

// Pt. 1
console.log(`Answer: ${codeChars - memChars}`);

// Pt. 2
console.log(`Answer: ${newLen - codeChars}`);
