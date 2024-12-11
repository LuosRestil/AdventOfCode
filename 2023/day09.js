const fs = require("fs");
const input = fs.readFileSync("inputs/day09.txt", { encoding: "utf-8" });
const rows = input.split("\n");

let total = 0;
for (let row of rows) {
  const sequences = [];
  curr = row
    .split(" ")
    // .reverse()  // commented out for part 1, uncommented for part 2
    .map((elem) => parseInt(elem));
  sequences.push(curr);
  while (!curr.every((elem) => elem === 0)) {
    const next = [];
    for (let i = 0; i < curr.length - 1; i++) {
      next.push(curr[i + 1] - curr[i]);
    }
    sequences.push(next);
    curr = next;
  }
  sequences[sequences.length - 1].push(0);
  for (let i = sequences.length - 1; i > 0; i--) {
    sequences[i - 1].push(lastElem(sequences[i - 1]) + lastElem(sequences[i]));
  }
  total += lastElem(sequences[0]);
}
console.log("Answer: " + total);

function lastElem(arr) {
  return arr[arr.length - 1];
}
