import fs from "fs";
import path from "node:path";

console.time();

const filename = "day21.txt";
let steps = 64;

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
for (let i = 0; i < steps; i++) {
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


function keyify(tile) {
  return tile[0] + ":" + tile[1];
}

function tileify(str) {
  return str.split(":").map((num) => parseInt(num));
}
