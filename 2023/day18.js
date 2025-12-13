import fs from 'fs';
const input = fs.readFileSync("inputs/day18.txt", { encoding: "utf-8" });
let lines = input.split("\n").map((line) => {
  const splitLine = line.split(" ");
  return {
    dir: splitLine[0],
    dist: parseInt(splitLine[1]),
  };
});

console.log("Answer 1: " + doTheThing(lines));

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

  let toFill = [floodFillTarget];
  while (toFill.length) {
    let curr = toFill.pop();
    grid[curr[0]][curr[1]] = "#";
    for (let neighbor of getNeighbors(grid, curr[0], curr[1])) {
      if (grid[neighbor[0]][neighbor[1]] !== "#") toFill.push(neighbor);
    }
  }

  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "#") count++;
    }
  }

  if (print) {
    grid.forEach((row) => console.log(row.join("")));
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
