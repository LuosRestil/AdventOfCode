import fs from "fs";
import path from "node:path";

console.time();

const filename = "day16.txt";

let input = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("")
  .map((digit) => parseInt(digit));

let list = [...input];
for (let i = 0; i < 100; i++) {
  list = phase(list);
}
console.log(`Part 1: ${list.join("").slice(0, 8)}`);

console.timeEnd();

function phase(list) {
  let outputs = [];
  for (let i = 0; i < list.length; i++) {
    outputs.push(calculateDigit(list, i));
  }
  return outputs;
}

function calculateDigit(list, idx) {
  let repeats = idx + 1;
  let ans = 0;
  for (let i = idx, sign = 0; i < list.length; i += repeats * 2, sign++) {
    let end = Math.min(i + repeats, list.length);
    let sum = 0;
    for (let j = i; j < end; j++) {
      sum += list[j];
    }
    ans += sum * (sign % 2 === 0 ? 1 : -1);
  }
  let digit = Math.abs(ans % 10);
  return digit;
}
