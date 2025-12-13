import fs from 'fs';

console.time();

const lines = fs.readFileSync("inputs/day15.txt", "utf-8").split("\n");
let a = parseInt(lines[0].split(" ")[4]);
let b = parseInt(lines[1].split(" ")[4]);
let total = 0;
for (let i = 0; i < 40_000_000; i++) {
  a *= 16807;
  a %= 2147483647;
  b *= 48271;
  b %= 2147483647;
  if ((a & ((1 << 16) - 1)) === (b & ((1 << 16) - 1))) {
    total++;
  }
}
console.log(`Part 1: ${total}`);

a = parseInt(lines[0].split(" ")[4]);
b = parseInt(lines[1].split(" ")[4]);
total = 0;
let avals = [];
let bvals = [];
let pairs = 0;
while (pairs < 5_000_000) {
  a *= 16807;
  a %= 2147483647;
  b *= 48271;
  b %= 2147483647;
  if (a % 4 === 0) avals.push(a);
  if (b % 8 === 0) bvals.push(b);
  if (avals.length && bvals.length) {
    pairs++;
    if (pairs % 100_000 === 0)
      console.log(pairs);
    if (
      (avals.shift() & ((1 << 16) - 1)) ===
      (bvals.shift() & ((1 << 16) - 1))
    ) {
      total++;
    }
  }
}
console.log(`Part 2: ${total}`);

console.timeEnd();
