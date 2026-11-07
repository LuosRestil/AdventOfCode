import fs from "fs";
import path from "node:path";

console.time();

const filename = "day24.txt";
const p2Iters = 200;

let grid = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row) => row.split(""));
let tmp = Array(grid.length)
  .fill(null)
  .map(() => Array(grid[0].length).fill(null));

let states = new Set();
states.add(stringify(grid));

let adjacents = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [0, -1],
];

let firstRepeatedState = null;
while (true) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let char = grid[i][j];
      tmp[i][j] = char;
      let adjacentBugs = 0;
      for (let adjacent of adjacents) {
        if (grid[i + adjacent[0]]?.[j + adjacent[1]] === "#") {
          adjacentBugs++;
        }
      }
      if (char === "#" && adjacentBugs !== 1) {
        tmp[i][j] = ".";
      } else if (char === "." && (adjacentBugs === 1 || adjacentBugs === 2)) {
        tmp[i][j] = "#";
      }
    }
  }
  copy(tmp, grid);
  let gridStr = stringify(grid);
  if (states.has(gridStr)) {
    firstRepeatedState = grid;
    break;
  }
  states.add(gridStr);
}

let biodiversityRating = 0;
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[0].length; j++) {
    let char = firstRepeatedState[i][j];
    let idx = i * grid[0].length + j;
    if (char === "#") {
      biodiversityRating += 2 ** idx;
    }
  }
}

console.log(`Part 1: ${biodiversityRating}`);

let map = {};
populateMapLevel(map, 0);
grid = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row) => row.split(""));
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[0].length; j++) {
    map[0][i][j] = [grid[i][j], grid[i][j]];
  }
}
let [curr, next] = [0, 1];

for (let i = 0; i < p2Iters; i++) {
  expandMap(map);

  for (let levelKey in map) {
    for (let rowKey in map[levelKey]) {
      for (let colKey in map[levelKey][rowKey]) {
        if (rowKey == 2 && colKey == 2) continue;
        let char = map[levelKey][rowKey][colKey][curr];
        map[levelKey][rowKey][colKey][next] = char;
        let adjacentBugs = countAdjacentBugs(
          map,
          parseInt(levelKey),
          parseInt(rowKey),
          parseInt(colKey),
        );
        if (char === "#" && adjacentBugs !== 1) {
          map[levelKey][rowKey][colKey][next] = ".";
        } else if (char === "." && (adjacentBugs === 1 || adjacentBugs === 2)) {
          map[levelKey][rowKey][colKey][next] = "#";
        }
      }
    }
  }

  [next, curr] = [curr, next];
}

let bugCount = 0;
for (let levelKey in map) {
  for (let rowKey in map[levelKey]) {
    for (let colKey in map[levelKey][rowKey]) {
      if (map[levelKey][rowKey][colKey][curr] === "#") bugCount++;
    }
  }
}

console.log(`Part 2: ${bugCount}`);

function expandMap(map) {
  let adjacentToCenter = [
    [1, 2],
    [3, 2],
    [2, 1],
    [2, 3],
  ];
  for (let levelKey in map) {
    // if this level has bugs on the top or bottom rows or left or right columns, populate a level above
    // if this level has bugs on (1, 2), (3, 2), (2, 1), or (2, 3) populate a level below
    let levelKeyInt = parseInt(levelKey);
    let level = map[levelKey];

    if (!map[levelKeyInt - 1]) {
      for (let col = 0; col < 5; col++) {
        if (level[0][col][curr] === "#" || level[4][col][curr] === "#") {
          populateMapLevel(map, levelKeyInt - 1);
        }
      }
      for (let row = 0; row < 5; row++) {
        if (level[row][0][curr] === "#" || level[row][4][curr] === "#") {
          populateMapLevel(map, levelKeyInt - 1);
        }
      }
    }

    if (!map[levelKeyInt + 1]) {
      for (let pos of adjacentToCenter) {
        if (level[pos[0]][pos[1]][curr] === "#") {
          populateMapLevel(map, levelKeyInt + 1);
        }
      }
    }
  }
}

function populateMapLevel(map, level) {
  map[level] = {};
  for (let i = 0; i < 5; i++) {
    map[level][i] = {};
    for (let j = 0; j < 5; j++) {
      map[level][i][j] = [".", "."];
    }
  }
}

function countAdjacentBugs(map, level, row, col) {
  let count = 0;
  // up
  if (row === 0) {
    if (map[level - 1]?.[1][2][curr] === "#") count++;
  } else if (row === 3 && col === 2) {
    for (let i = 0; i < 5; i++) {
      if (map[level + 1]?.[4][i][curr] === "#") count++;
    }
  } else {
    if (map[level][row - 1][col][curr] === "#") count++;
  }
  // down
  if (row === 4) {
    if (map[level - 1]?.[3][2][curr] === "#") count++;
  } else if (row === 1 && col === 2) {
    for (let i = 0; i < 5; i++) {
      if (map[level + 1]?.[0][i][curr] === "#") count++;
    }
  } else {
    if (map[level][row + 1][col][curr] === "#") count++;
  }
  // left
  if (col === 0) {
    if (map[level - 1]?.[2][1][curr] === "#") count++;
  } else if (col === 3 && row === 2) {
    for (let i = 0; i < 5; i++) {
      if (map[level + 1]?.[i][4][curr] === "#") count++;
    }
  } else {
    if (map[level][row][col - 1][curr] === "#") count++;
  }
  // right
  if (col === 4) {
    if (map[level - 1]?.[2][3][curr] === "#") count++;
  } else if (col === 1 && row === 2) {
    for (let i = 0; i < 5; i++) {
      if (map[level + 1]?.[i][0][curr] === "#") count++;
    }
  } else {
    if (map[level][row][col + 1][curr] === "#") count++;
  }
  return count;
}

function copy(src, dest) {
  for (let i = 0; i < src.length; i++) {
    for (let j = 0; j < src[0].length; j++) {
      dest[i][j] = src[i][j];
    }
  }
}

function stringify(grid) {
  return grid.map((row) => row.join("")).join("");
}

function printMap(map) {
  let levels = Object.keys(map)
    .map((key) => parseInt(key))
    .toSorted((a, b) => a - b);
  for (let level of levels) {
    console.log(`depth: ${level}`);
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        process.stdout.write(map[level][i][j][curr]);
      }
      process.stdout.write('\n');
    }
  }
}
