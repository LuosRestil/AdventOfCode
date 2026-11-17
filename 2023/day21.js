import fs from "fs";
import path from "node:path";

console.time();

const filename = "day21.txt";
let stepsToTake = 64;

let grid = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row) => row.split(""));
let startTile = [-1, -1];
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[row][col] === "S") {
      startTile = [row, col];
      grid[row][col] = ".";
    }
  }
}

let dirs = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
let tiles = new Set([keyify(startTile)]);
for (let i = 0; i < stepsToTake; i++) {
  let nextTiles = new Set();
  for (let tileStr of tiles) {
    let tile = tileify(tileStr);
    for (let dir of dirs) {
      let neighbor = [tile[0] + dir[0], tile[1] + dir[1]];
      if (grid[neighbor[0]]?.[neighbor[1]] === ".") {
        nextTiles.add(keyify(neighbor));
      }
    }
  }
  tiles = nextTiles;
}

console.log(`Part 1: ${tiles.size}`);

stepsToTake = 26501365;
let outerRingSize = ((stepsToTake - 65) / 131) * 2 + 1;
let [no, ne, co, ce] = [0, 0, 0, 0];
let oddParity = stepsToTake % 2 !== 0;
if (oddParity) {
  no++;
} else {
  ne++;
}
oddParity = !oddParity;
for (let i = 3; i <= outerRingSize; i += 2) {
  let diamonds = i * 2 + (i - 2) * 2;
  if (oddParity) {
    no += diamonds / 2;
    co += diamonds / 2;
  } else {
    ne += diamonds / 2;
    ce += diamonds / 2;
  }
  oddParity = !oddParity;
}
// no (normal odd), ne (normal even), co (composite odd), ce (composite even)
// values derived from equations
// 1no = 3738 -> 65 steps
// 1ne + 4no + 4co = 33270 -> 196 steps
// 1no + 4ne + 4ce + 8no + 8co = 92194 -> 327 steps
// 1ne + 4no + 4co + 8ne + 8ce + 12no + 12co = 180510 -> 458 steps
console.log(`Part 2: ${no * 3738 + ne * 3598 + co * 3680 + ce * 3680}`);

console.timeEnd();

function keyify(tile) {
  return tile[0] + ":" + tile[1];
}

function tileify(str) {
  return str.split(":").map((num) => parseInt(num));
}
