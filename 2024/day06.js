console.time("time");

import fs from 'fs';

const nextPosMods = {
  "^": [-1, 0],
  v: [1, 0],
  "<": [0, -1],
  ">": [0, 1],
};
const turns = {
  "^": ">",
  v: "<",
  "<": "^",
  ">": "v",
};

const filepath = "inputs/day06.txt";

const path = runPt1();
console.log(`Part 1: ${Object.keys(path).length}`);

runPt2(Object.keys(path));

console.timeEnd("time");

function runPt1() {
  const grid = getGrid();
  const path = solve(grid);
  return path;
}

function runPt2(trodden) {
  const grid = getGrid();
  const guard = getGuard(grid);
  let count = 0;
  for (let key of trodden) {
    const pos = key.split(':').map(num => Number(num));
    if (pos[0] === guard.pos[0] && pos[1] === guard.pos[1])   
      continue;
    grid[pos[0]][pos[1]] = "#";
    const completed = solve(grid);
    if (!completed) count++;
    grid[pos[0]][pos[1]] = ".";
  }
  console.log(`Part 2: ${count}`);
}

function solve(grid) {
  const guard = getGuard(grid);
  const path = {
    [`${guard.pos[0]}:${guard.pos[1]}`]: ["^"],
  };
  while (isInGrid(grid, guard.pos)) {
    if (!tick(grid, guard, path)) return null;
  }
  return path;
}

function tick(grid, guard, path) {
  move(grid, guard);
  const pathKey = `${guard.pos[0]}:${guard.pos[1]}`;
  if (path[pathKey] && path[pathKey].includes(guard.dir)) return false;
  if (isInGrid(grid, guard.pos)) {
    path[pathKey] = path[pathKey] ? path[pathKey] : [];
    path[pathKey].push(guard.dir);
  }
  return true;
}

function move(grid, guard) {
  const nextPosMod = nextPosMods[guard.dir];
  const nextPos = [guard.pos[0] + nextPosMod[0], guard.pos[1] + nextPosMod[1]];
  if (isInGrid(grid, nextPos) && grid[nextPos[0]][nextPos[1]] == "#") {
    guard.dir = turns[guard.dir];
  } else {
    guard.pos = nextPos;
  }
}

function getGuard(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "^") return { pos: [i, j], dir: "^" };
    }
  }
}

function isInGrid(grid, pos) {
  return (
    pos[0] >= 0 &&
    pos[0] < grid.length &&
    pos[1] >= 0 &&
    pos[1] < grid[0].length
  );
}

function getGrid() {
  return fs
    .readFileSync(filepath, { encoding: "utf-8" })
    .split("\n")
    .map((line) => line.split(""));
}
