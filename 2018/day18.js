import fs from "fs";
import path from "node:path";

console.time();

let grid = run(10);
let counts = getGridCounts(grid);
console.log(`Part 1: ${counts.trees * counts.lumberyards}`);

// running 1000 iters and looking for repears reveals 477 - 505 is a loop
let loopSize = 505 - 477;
let targetMinutes = 1000000000;
while (targetMinutes > 505) {
  targetMinutes -= loopSize;
}
grid = run(targetMinutes);
counts = getGridCounts(grid);
console.log(`Part 2: ${counts.lumberyards * counts.trees}`);

console.timeEnd();

function getNeighborCounts(grid, row, col) {
  let lumberyards = 0;
  let trees = 0;
  let open = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      let neighborRow = row + i;
      let neighborCol = col + j;
      if (isInBounds(grid, neighborRow, neighborCol)) {
        if (grid[neighborRow][neighborCol] === "#") {
          lumberyards++;
        } else if (grid[neighborRow][neighborCol] === "|") {
          trees++;
        } else {
          open++;
        }
      }
    }
  }
  return { lumberyards, trees, open };
}

function getGridCounts(grid) {
  let trees = 0;
  let lumberyards = 0;
  let open = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      let char = grid[row][col];
      if (char === "#") lumberyards++;
      else if (char === "|") trees++;
      else open++;
    }
  }
  return { trees, lumberyards, open };
}

function isInBounds(grid, row, col) {
  return row >= 0 && col >= 0 && row < grid.length && col < grid[0].length;
}

function run(iters) {
  let grid = fs
    .readFileSync(
      path.join(import.meta.dirname, "inputs", "day18.txt"),
      "utf-8",
    )
    .split("\n")
    .map((row) => row.split(""));
  for (let i = 0; i < iters; i++) {
    let newGrid = [];
    for (let row = 0; row < grid.length; row++) {
      let newRow = [];
      for (let col = 0; col < grid[0].length; col++) {
        let counts = getNeighborCounts(grid, row, col);
        let char = grid[row][col];
        if (char === ".") {
          if (counts.trees >= 3) newRow.push("|");
          else newRow.push(".");
        } else if (char === "|") {
          if (counts.lumberyards >= 3) newRow.push("#");
          else newRow.push("|");
        } else if (char === "#") {
          if (counts.lumberyards >= 1 && counts.trees >= 1) newRow.push("#");
          else newRow.push(".");
        }
      }
      newGrid.push(newRow);
    }
    grid = newGrid;
  }
  return grid;
}
