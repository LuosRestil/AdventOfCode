import fs from 'fs';

let input = fs.readFileSync('inputs/day02.txt', 'utf8');

let presents = input.split("\n");

// Pt. 1

let squareFeetOfWrappingPaper = 0;

for (let present of presents) {
  let dimensions = present
    .split("x")
    .map((dimension) => parseInt(dimension, 10));
  let x = dimensions[0] * dimensions[1];
  let y = dimensions[0] * dimensions[2];
  let z = dimensions[1] * dimensions[2];
  squareFeetOfWrappingPaper += 2 * x + 2 * y + 2 * z + Math.min(x, y, z);
}

console.log(`Answer: ${squareFeetOfWrappingPaper}`);

// Pt. 2

let feetOfRibbon = 0;

for (let present of presents) {
  let dimensions = present
    .split("x")
    .map((dimension) => parseInt(dimension, 10))
    .sort((a, b) => a - b);
  let bow = dimensions[0] * dimensions[1] * dimensions[2];
  let ribbon = dimensions[0] * 2 + dimensions[1] * 2;
  feetOfRibbon += bow + ribbon;
}

console.log(`Answer: ${feetOfRibbon}`);
