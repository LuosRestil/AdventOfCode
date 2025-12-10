const fs = require("fs");

console.time();

const nums = fs
  .readFileSync("inputs/day01.txt", "utf-8")
  .split("\n")
  .map((num) => parseInt(num));

console.log(`Part 1: ${nums.reduce((acc, curr) => acc + curr)}`);

let i = 0;
let total = 0;
let seen = new Set([0]);
while (true) {
  total += nums[i % nums.length];
  if (seen.has(total)) {
    console.log(`Part 2: ${total}`);
    break;
  }
  seen.add(total);
  i++;
}

console.timeEnd();