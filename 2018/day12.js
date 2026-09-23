import fs from "fs";
import path from "node:path";

const inputRows = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", "day12.txt"), "utf-8")
  .split("\n");

console.log(`Part 1: ${solveForIters(20)}`);

let last = 0;
for (let i = 0; i < 200; i++) {
  let solution = solveForIters(i);
  console.log(i, solution, solution - last);
  last = solution;
}

// from iteration 162 onwards, we always add 73 each iteration
let iteration162 = 12203;
let remainingIters = 50000000000 - 162;
console.log(iteration162 + remainingIters * 73);


function solveForIters(iters) {
  let state = Object.fromEntries(
    inputRows[0]
      .split(" ")[2]
      .split("")
      .map((val, idx) => [idx, val]),
  );
  const notes = new Set(
    inputRows
      .slice(2)
      .map((row) => {
        const split = row.split(" => ");
        const pattern = split[0];
        const result = split[1];
        return { pattern, result };
      })
      .filter((note) => note.result === "#")
      .map((note) => note.pattern),
  );

  for (let i = 0; i < iters; i++) {
    let nextState = {};
    let indices = Object.keys(state).map((key) => parseInt(key));
    for (let i = Math.min(...indices) - 5; i <= Math.max(...indices) + 5; i++) {
      let slice = [
        state[i - 2] ?? ".",
        state[i - 1] ?? ".",
        state[i] ?? ".",
        state[i + 1] ?? ".",
        state[i + 2] ?? ".",
      ].join("");
      nextState[i] = notes.has(slice) ? "#" : ".";
    }
    state = nextState;
    trimState(state);
  }

  let plantedPotIndexTotal = Object.entries(state)
    .filter((entry) => entry[1] === "#")
    .map((entry) => parseInt(entry[0]))
    .reduce((acc, curr) => acc + curr, 0);
  return plantedPotIndexTotal;
}

function trimState(state) {
  let indices = Object.keys(state)
    .map((key) => parseInt(key))
    .toSorted((a, b) => a - b);
  let minIdx = Math.min(...indices);
  let maxIdx = Math.max(...indices);
  for (let i = minIdx; i < maxIdx; i++) {
    if (state[i] === ".") {
      delete state[i];
    } else {
      break;
    }
  }
  for (let i = maxIdx; i > minIdx; i--) {
    if (state[i] === ".") {
      delete state[i];
    } else {
      break;
    }
  }
}

function printState(state) {
  let repr = Object.entries(state)
    .map((entry) => [parseInt(entry[0]), entry[1]])
    .toSorted((a, b) => a[0] - b[0])
    .map((entry) => entry[1])
    .join("");
  console.log(repr);
}
