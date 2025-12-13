import fs from 'fs';
const input = fs.readFileSync("inputs/day11.txt", { encoding: "utf-8" });
const grid = input.split("\n").map((row) => row.split(""));

const emptyRows = getEmptyRows();
const emptyCols = getEmptyCols();

const galaxies = findGalaxies();
let totalDist1 = 0;
let totalDist2 = 0;
for (let i = 0; i < galaxies.length - 1; i++) {
  for (let j = i + 1; j < galaxies.length; j++) {
    const src = galaxies[i];
    const dest = galaxies[j];
    const emptyRowsCrossed = emptyRows.filter(
      (row) =>
        row > Math.min(src[0], dest[0]) && row < Math.max(src[0], dest[0])
    );
    const emptyColsCrossed = emptyCols.filter(
      (col) =>
        col > Math.min(src[1], dest[1]) && col < Math.max(src[1], dest[1])
    );
    const dist = Math.abs(src[0] - dest[0]) + Math.abs(src[1] - dest[1]);
    totalDist1 += dist + emptyRowsCrossed.length + emptyColsCrossed.length;
    totalDist2 +=
      dist + emptyRowsCrossed.length * 999_999 + emptyColsCrossed.length * 999_999;
  }
}
console.log("Answer 1: " + totalDist1);
console.log("Answer 2: " + totalDist2);

function getEmptyRows() {
  const emptyRows = [];
  for (let row = 0; row < grid.length; row++) {
    if (grid[row].every((col) => col === ".")) emptyRows.push(row);
  }
  return emptyRows;
}

function getEmptyCols() {
  const emptyCols = [];
  for (let col = 0; col < grid[0].length; col++) {
    let empty = true;
    for (let row of grid) {
      if (row[col] !== ".") {
        empty = false;
        break;
      }
    }
    if (empty) emptyCols.push(col);
  }
  return emptyCols;
}

function findGalaxies() {
  const galaxies = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "#") galaxies.push([i, j]);
    }
  }
  return galaxies;
}
