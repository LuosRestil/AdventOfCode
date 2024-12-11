const fs = require('fs');

let input = fs.readFileSync('inputs/day01.txt', {encoding: 'utf-8'})
  .split('\n')
  .map(line => line.split(/\s+/))
  .map(line => line.map(num => Number(num)));
let left = input
  .map(line => line[0])
  .toSorted((a, b) => a - b);
let right = input
  .map(line => line[1])
  .toSorted((a, b) => a - b);
let diff = 0;
for (let i = 0; i < left.length; i++) {
  diff += Math.abs(left[i] - right[i]);
}
console.log(`Part 1: ${diff}`);

let simScore = 0;
for (const lNum of left) {
  let count = 0;
  for (const rNum of right) {
    if (lNum === rNum) count++;
  }
  simScore += lNum * count;
}
console.log(`Part 2: ${simScore}`);
