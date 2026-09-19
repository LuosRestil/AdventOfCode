import { getHashKey, getInput } from "../utils.js";

const input = getInput("day18.txt");
let lines = input.split("\n").map((line) => {
  const splitLine = line.split(" ");
  return {
    dir: splitLine[0],
    dist: parseInt(splitLine[1]),
    color: splitLine[2].slice(1, splitLine[2].length - 1),
  };
});

console.log(`Part 1: ${getArea(lines)}`);

function getArea(lines) {
  let curr = [0, 0];
  let map = { 0: [0] }; // keys are path rows, vals are path columns
  for (let line of lines) {
    if (line.dir === "U" || line.dir === "D") {
      for (let i = 0; i < line.dist; i++) {
        curr[0] += line.dir === "U" ? -1 : line.dir === "D" ? 1 : 0;
        if (!map[curr[0]]) map[curr[0]] = [];
        map[curr[0]].push(curr[1]);
      }
    } else {
      curr[1] += line.dir === 'L' ? -line.dist : line.dist;
      map[curr[0]].push(curr[1]);
    }
  }
  let total = 0;
  for (let row in map) {
    let rowTotal = 0;
    let cols = map[row].toSorted((a, b) => a - b);
    for (let i = 0; i < cols.length; i++) {
      if (i == cols.length - 1 || cols[i + 1] === cols[i] + 1) {
        rowTotal += 1;
        continue;
      }
      let gapLen = cols[i + 1] - cols[i];
      rowTotal += gapLen;
    }
    // console.log(row, rowTotal);
    total += rowTotal;
  }
  return total;
}

console.log("Answer 1: " + doTheThing(lines, true));

let digitToDir = {
  0: "R",
  1: "D",
  2: "L",
  3: "U",
};

lines = input.split("\n").map((line) => {
  const hex = line.split(" ")[2];
  const digits = hex.slice(2, hex.length - 1);
  const distDigits = digits.slice(0, digits.length - 1);
  const dirDigit = digits[digits.length - 1];
  const dir = digitToDir[dirDigit];
  const dist = parseInt(distDigits, 16);

  return { dir, dist };
});

function doTheThing(lines, print = false) {
  let nodes = [[0, 0]];
  for (let line of lines) {
    let prevNode = nodes[nodes.length - 1];
    if (line.dir === "U") nodes.push([prevNode[0] - line.dist, prevNode[1]]);
    else if (line.dir === "D")
      nodes.push([prevNode[0] + line.dist, prevNode[1]]);
    else if (line.dir === "L")
      nodes.push([prevNode[0], prevNode[1] - line.dist]);
    else if (line.dir === "R")
      nodes.push([prevNode[0], prevNode[1] + line.dist]);
    else throw new Error("oh god oh fuck");
  }
  const minRow = Math.min(...nodes.map((node) => node[0]));
  const maxRow = Math.max(...nodes.map((node) => node[0]));
  const minCol = Math.min(...nodes.map((node) => node[1]));
  const maxCol = Math.max(...nodes.map((node) => node[1]));
  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;
  let row = -minRow;
  let col = -minCol;

  // create 2d array of size rows x cols
  let grid = Array(rows)
    .fill()
    .map(() => Array(cols).fill("."));

  grid[row][col] = "#";
  let floodFillTarget;

  for (let line of lines) {
    if (line.dir === "U") {
      for (let i = 0; i < line.dist; i++) {
        row--;
        grid[row][col] = "#";
        floodFillTarget = [row, col + 1];
      }
    } else if (line.dir === "D") {
      for (let i = 0; i < line.dist; i++) {
        row++;
        grid[row][col] = "#";
      }
    } else if (line.dir === "L") {
      for (let i = 0; i < line.dist; i++) {
        col--;
        grid[row][col] = "#";
      }
    } else if (line.dir === "R") {
      for (let i = 0; i < line.dist; i++) {
        col++;
        grid[row][col] = "#";
      }
    } else throw new Error("oh god oh fuck");
  }

  // let toFill = [floodFillTarget];
  // while (toFill.length) {
  //   let curr = toFill.pop();
  //   grid[curr[0]][curr[1]] = "#";
  //   for (let neighbor of getNeighbors(grid, curr[0], curr[1])) {
  //     if (grid[neighbor[0]][neighbor[1]] !== "#") toFill.push(neighbor);
  //   }
  // }

  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "#") count++;
    }
  }

  if (print) {
    for (let i = 0; i < grid.length; i++) {
      console.log(i + ": " + grid[i].join(""));
    }
    // grid.forEach((row) => console.log(row.join("")));
    // for (let i = grid.length - 1; i >= 0; i--) {
    //   console.log(i + ": " + grid[i].filter(char => char === '#').length);
    // }
  }
  return count;
}

function getNeighbors(grid, row, col) {
  const neighbors = [];
  if (row > 0) neighbors.push([row - 1, col]);
  if (row < grid.length - 1) neighbors.push([row + 1, col]);
  if (col > 0) neighbors.push([row, col - 1]);
  if (col < grid[0].length - 1) neighbors.push([row, col + 1]);
  return neighbors;
}
