import fs from "fs";
import path from "path";

function getInput(filename) {
  const baseDir = path.dirname(process.argv[1]);
  return fs.readFileSync(path.join(baseDir, "inputs", filename), {
    encoding: "utf-8",
  });
}

function getAllPermutations(list) {
  if (list.length === 1) {
    return [list];
  }

  let perms = [];
  for (let i = 0; i < list.length; i++) {
    let curr = list[i];
    let remaining = getAllPermutations(
      list.slice(0, i).concat(list.slice(i + 1, list.length))
    );
    for (let perm of remaining) {
      perms.push([curr, ...perm]);
    }
  }

  return perms;
}

function getHashKey(...args) {
  return args.join(":");
}

function getNextIdx(arr, idx) {
  idx++;
  if (idx === arr.length) idx = 0;
  return idx;
}

function getPrevIdx(arr, idx) {
  idx--;
  if (idx < 0) idx = arr.length - 1;
  return idx;
}

function find2D(grid, char) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === char) return [i, j];
    }
  }
  return null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pointsAreEqual(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function getNeighbors(grid, pos) {
  return [
    grid[pos[0] - 1][pos[1]],
    grid[pos[0] + 1][pos[1]],
    grid[pos[0]][pos[1] - 1],
    grid[pos[0]][pos[1] + 1],
  ];
}

function isInGrid(grid, pos) {
  return (
    pos[0] >= 0 &&
    pos[0] < grid.length &&
    pos[1] >= 0 &&
    pos[1] < grid[0].length
  );
}

function gridGetPos(grid, pos) {
  return grid[pos[0]][pos[1]];
}

export default {
  getInput,
  getAllPermutations,
  getHashKey,
  getNextIdx,
  getPrevIdx,
  find2D,
  sleep,
  pointsAreEqual,
  getNeighbors,
  isInGrid,
  gridGetPos
};
