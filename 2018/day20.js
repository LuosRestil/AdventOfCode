import fs from "fs";
import path from "node:path";

console.time();

let input = fs.readFileSync(
  path.join(import.meta.dirname, "inputs", "day20.txt"),
  "utf-8",
);

let grid = Array(1000)
  .fill(null)
  .map(() => Array(1000).fill(0));
let stack = [];
let curr = [500, 500, 0]; // y, x, distance from start
let maxDist = 0;
let over1kDoors = 0;
grid[curr[0]][curr[1]] = 9;

for (let char of input) {
  let dist = 0;
  switch (char) {
    case "N":
      if (grid[curr[0] - 2][curr[1]] === 0) {
        grid[curr[0] - 1][curr[1]] = 2;
        grid[curr[0] - 2][curr[1]] = 1;
        dist = curr[2] + 1;
        if (dist >= 1000) over1kDoors++;
      }
      curr = [curr[0] - 2, curr[1], dist];
      break;
    case "S":
      if (grid[curr[0] + 2][curr[1]] === 0) {
        grid[curr[0] + 1][curr[1]] = 2;
        grid[curr[0] + 2][curr[1]] = 1;
        dist = curr[2] + 1;
        if (dist >= 1000) over1kDoors++;
      }
      curr = [curr[0] + 2, curr[1], dist];
      break;
    case "E":
      if (grid[curr[0]][curr[1] + 2] === 0) {
        grid[curr[0]][curr[1] + 1] = 2;
        grid[curr[0]][curr[1] + 2] = 1;
        dist = curr[2] + 1;
        if (dist >= 1000) over1kDoors++;
      }
      curr = [curr[0], curr[1] + 2, dist];
      break;
    case "W":
      if (grid[curr[0]][curr[1] - 2] === 0) {
        grid[curr[0]][curr[1] - 1] = 2;
        grid[curr[0]][curr[1] - 2] = 1;
        dist = curr[2] + 1;
        if (dist >= 1000) over1kDoors++;
      }
      curr = [curr[0], curr[1] - 2, dist];
      break;
    case "(":
      stack.push([curr[0], curr[1], curr[2]]);
      break;
    case ")":
      curr = stack.pop();
      break;
    case "|":
      curr = stack[stack.length - 1];
      break;
  }
  if (curr[2] > maxDist) {
    maxDist = curr[2];
  }
}

console.log(`Part 1: ${maxDist}`);
console.log(`Part 2: ${over1kDoors}`);

console.timeEnd();
