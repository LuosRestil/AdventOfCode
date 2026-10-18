import fs from "fs";
import path from "node:path";

console.time();

let filename = "day22.txt";

let input = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n");

let depth = parseInt(input[0].split(" ")[1]);
let targetNums = input[1]
  .split(" ")[1]
  .split(",")
  .map((num) => parseInt(num));
let target = { x: targetNums[0], y: targetNums[1] };

let geologicIndices = [];
let erosionLevels = [];
let types = [];
for (let y = 0; y <= target.y + 20; y++) {
  let gRow = []
  let eRow = [];
  let tRow = [];
  geologicIndices.push(gRow);
  erosionLevels.push(eRow);
  types.push(tRow);
  for (let x = 0; x <= target.x + 70; x++) {
    gRow.push(getGeologicIndex(x, y));
    eRow.push(getErosionLevel(x, y));
    tRow.push(erosionLevels[y][x] % 3);
  }
}

let total = 0;
for (let y = 0; y <= target.y; y++) {
  for (let x = 0; x <= target.x; x++) {
    total += types[y][x];
  }
}
console.log(`Part 1: ${total}`);

let [ROCKY, WET, NARROW] = [0, 1, 2];
let [TORCH, CLIMBING_GEAR, NEITHER] = [0, 1, 2];
let toolTypeMap = {
  [TORCH]: {
    [ROCKY]: true,
    [NARROW]: true,
    [WET]: false,
  },
  [CLIMBING_GEAR]: {
    [ROCKY]: true,
    [WET]: true,
    [NARROW]: false,
  },
  [NEITHER]: {
    [WET]: true,
    [NARROW]: true,
    [ROCKY]: false,
  },
};

let dest = { x: target.x, y: target.y, tool: TORCH };
let startNode = { x: 0, y: 0, tool: TORCH, cost: 0 };
let openSet = [startNode];
let closedSet = {};
let lowestCost = Infinity;

while (openSet.length) {
  let winnerIdx = 0;
  let winnerF = Infinity;
  for (let i = 0; i < openSet.length; i++) {
    let heuristic = Math.abs(openSet[i].x - dest.x) + Math.abs(openSet[i].y - dest.y);
    let f = openSet[i].cost + heuristic;
    if (f < winnerF) {
      winnerF = f;
      winnerIdx = i;
    }
  }
  let curr = openSet.splice(winnerIdx, 1)[0];
  let currType = types[curr.y][curr.x];

  if (curr.y === dest.y && curr.x === dest.x && curr.tool === dest.tool) {
    lowestCost = curr.cost;
    break;
  }

  if (!closedSet[curr.y]) closedSet[curr.y] = {};
  if (!closedSet[curr.y][curr.x]) closedSet[curr.y][curr.x] = {};
  closedSet[curr.y][curr.x][curr.tool] = true;

  let neighbors = [
    // move
    { y: curr.y - 1, x: curr.x, tool: curr.tool, cost: curr.cost + 1 },
    { y: curr.y + 1, x: curr.x, tool: curr.tool, cost: curr.cost + 1 },
    { y: curr.y, x: curr.x - 1, tool: curr.tool, cost: curr.cost + 1 },
    { y: curr.y, x: curr.x + 1, tool: curr.tool, cost: curr.cost + 1 },
    // change tool
    {
      y: curr.y,
      x: curr.x,
      tool: TORCH,
      cost: curr.cost + 7,
    },
    {
      y: curr.y,
      x: curr.x,
      tool: CLIMBING_GEAR,
      cost: curr.cost + 7,
    },
    {
      y: curr.y,
      x: curr.x,
      tool: NEITHER,
      cost: curr.cost + 7,
    },
  ];
  neighbors = neighbors.filter((neighbor) => {
    if (closedSet[neighbor.y]?.[neighbor.x]?.[neighbor.tool]) return false;
    if (neighbor.y < 0 || neighbor.x < 0) return false;
    // if (neighbor.y >= types.length || neighbor.x >= types[0].length) {
    //   throw new Error("exceeded grid bounds");
    // }
    let neighborType = types[neighbor.y][neighbor.x];
    return (
      toolTypeMap[neighbor.tool][neighborType] &&
      toolTypeMap[neighbor.tool][currType]
    );
  });

  for (let neighbor of neighbors) {
    let existing = openSet.find(
      (elem) =>
        elem.y === neighbor.y &&
        elem.x === neighbor.x &&
        elem.tool === neighbor.tool,
    );
    if (existing) {
      if (neighbor.cost < existing.cost) {
        existing.cost = neighbor.cost;
      }
    } else {
      openSet.push(neighbor);
    }
  }
}

console.log(`Part 2: ${lowestCost}`);

console.timeEnd();

function getGeologicIndex(x, y) {
  if (y === 0 && x === 0) return 0;
  if (y === target.y && x === target.x) return 0;
  if (y === 0) return x * 16807;
  if (x === 0) return y * 48271;
  return erosionLevels[y][x - 1] * erosionLevels[y - 1][x];
}

function getErosionLevel(x, y) {
  return (geologicIndices[y][x] + depth) % 20183;
}
