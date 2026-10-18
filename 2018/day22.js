import fs from "fs";
import path from "node:path";

console.time();

let filename = "day22.txt";

let input = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n");

let depth = parseInt(input[0].split(" ")[1]);
let targetNums = input[1]
  .split(" ")[1]
  .split(",")
  .map((num) => parseInt(num));
let target = { x: targetNums[0], y: targetNums[1] };

let geologicIndices = [];
let erosionLevels = [];
let types = [];
for (let y = 0; y <= target.y; y++) {
  let gRow = [];
  let eRow = [];
  let tRow = [];
  geologicIndices.push(gRow);
  erosionLevels.push(eRow);
  types.push(tRow);
  for (let x = 0; x <= target.x; x++) {
    gRow.push(getGeologicIndex(x, y));
    eRow.push(getErosionLevel(x, y));
    tRow.push(erosionLevels[y][x] % 3);
  }
}

let p1Ans = types.reduce((rowAcc, rowCurr) => rowAcc + rowCurr.reduce((typeAcc, typeCurr) => typeAcc + typeCurr, 0), 0);
console.log(`Part 1: ${p1Ans}`);

console.timeEnd();

function getGeologicIndex(x, y) {
  if (y === 0 && x === 0) return 0;
  if (y === target.y && x === target.x) return 0;
  if (y === 0) return x * 16807;
  if (x === 0) return y * 48271;
  return erosionLevels[y][x - 1] * erosionLevels[y - 1][x];
}

function getErosionLevel(x, y) {
  return (geologicIndices[y][x] + depth) % 20183;
}
