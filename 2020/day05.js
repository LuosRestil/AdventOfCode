import { getInput } from "../utils.js";

const lines = getInput("day05.txt").split("\n");
const seats = {};
console.log(`Part 1: ${Math.max(...lines.map((line) => getSeatId(line)))}`);
let shortRows = {};
for (let [key, val] of Object.entries(seats)) {
  if (val.length !== 8) {
    shortRows[key] = val;
  }
}
let myRow = Object.entries(shortRows).toSorted((a, b) => a[0] - b[0])[1][0];
let cols = seats[myRow];
for (let i = 0; i < 8; i++) {
  if (!cols.includes(i)) {
    console.log(`Part 2: ${parseInt(myRow) * 8 + i}`);
  }
}


function getSeatId(line) {
  const row = bin(line.slice(0, 7), 0, 127);
  const col = bin(line.slice(7), 0, 8);
  if (!seats[row]) seats[row] = [];
  seats[row].push(col);
  return row * 8 + col;
}

function bin(str, min, max) {
  let [low, high] = [min, max];
  for (let char of str) {
    let mid = Math.ceil((high - low) / 2) + low;
    if (char === 'F' || char === 'L') high = mid;
    else low = mid;
  }
  return low;
}
