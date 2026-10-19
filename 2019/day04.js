import fs from "fs";
import path from "node:path";

console.time();

const filename = "day04.txt";

let input = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("-")
  .map((num) => parseInt(num));
let rangeStart = input[0];
let rangeEnd = input[1];

let total1 = 0;
let total2 = 0;
for (let i = rangeStart; i <= rangeEnd; i++) {
  let analysis = analyze(i.toString());
  if (analysis.noDecrease && analysis.hasDouble) {
    total1++;
    if (analysis.hasOnlyDouble) {
      total2++;
    }
  }
}

console.log(`Part 1: ${total1}`);
console.log(`Part 2: ${total2}`);

console.timeEnd();

function analyze(numStr) {
  let noDecrease = true;
  let hasDouble = false;
  let hasOnlyDouble = false;
  for (let i = 0; i < numStr.length - 1; i++) {
    if (numStr[i] > numStr[i + 1]) {
      noDecrease = false;
    } else if (numStr[i] === numStr[i + 1]) {
      hasDouble = true;
      if (numStr[i - 1] !== numStr[i] && numStr[i + 2] !== numStr[i]) {
        hasOnlyDouble = true;
      }
    }
  }
  return { noDecrease, hasDouble, hasOnlyDouble };
}
