import fs from "fs";
import path from "node:path";

console.time();

const filename = "day10.txt";

let grid = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row) => row.split(""));

let maxLinesOfSight = 0;
let linesOfSight = null;
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[0].length; j++) {
    if (grid[i][j] === ".") continue;
    let res = getLinesOfSight(grid, i, j);
    if (Object.keys(res).length > maxLinesOfSight) {
      maxLinesOfSight = Object.keys(res).length;
      linesOfSight = res;
    }
  }
}
let angles = Object.keys(linesOfSight).toSorted(
  (a, b) => parseFloat(a) - parseFloat(b),
);
console.log(`Part 1: ${angles.length}`);

for (let angle of angles) {
  linesOfSight[angle].sort((a, b) => a[2] - b[2]);
}

let angleIdx = 0;
let lastBlast = null;
for (let i = 0; i < 200; i++) {
  while (!linesOfSight[angles[angleIdx]].length) {
    angleIdx++;
    if (angleIdx === angles.length) angleIdx = 0;
  }
  lastBlast = linesOfSight[angles[angleIdx]].shift();
  angleIdx++;
  if (angleIdx === angles.length) angleIdx = 0;
}
console.log(`Part 2: ${lastBlast[0] + lastBlast[1] * 100}`);

console.timeEnd();

function getLinesOfSight(grid, row, col) {
  let angles = {};
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (row === i && col === j) continue; // don't view self
      if (grid[i][j] === ".") continue;
      let xDiff = j - col;
      let yDiff = i - row;
      let angle = Math.atan2(xDiff, -yDiff);
      if (angle < 0) {
        angle += 2 * Math.PI;
      }
      let distSq = xDiff * xDiff + yDiff * yDiff;
      if (!angles[angle]) {
        angles[angle] = [];
      }
      angles[angle].push([i, j, distSq]);
    }
  }

  return angles;
}
