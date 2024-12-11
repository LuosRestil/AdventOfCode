console.time('runtime');
const fs = require("fs");
const input = fs.readFileSync("inputs/day10.txt", { encoding: "utf-8" });
let grid = input.split("\n");

const egresses = {
  "-": ["LEFT", "RIGHT"],
  7: ["LEFT", "DOWN"],
  F: ["DOWN", "RIGHT"],
  "|": ["UP", "DOWN"],
  L: ["UP", "RIGHT"],
  J: ["LEFT", "UP"],
};

const egressOpposites = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

const sRow = grid.findIndex((row) => row.includes("S"));
const sCol = grid[sRow].indexOf("S");
grid = grid.map((row) => row.split(""));
let curr = [sRow, sCol];
const startingEgress = findStartingEgresses(sRow, sCol)[0];
switch (startingEgress) {
  case "UP":
    curr[0] -= 1;
    break;
  case "DOWN":
    curr[0] += 1;
    break;
  case "LEFT":
    curr[1] -= 1;
    break;
  case "RIGHT":
    curr[1] += 1;
    break;
  default:
    throw new Error("oh god oh fuck");
}
let steps = 1;
let lastEgress = startingEgress;
const loopBlocks = {};
loopBlocks[`${sRow}:${sCol}`] = startingEgress;

while (curr[0] !== sRow || curr[1] !== sCol) {
  steps++;
  const nextEgress = egresses[grid[curr[0]][curr[1]]].find(
    (egress) => egress !== egressOpposites[lastEgress]
  );
  loopBlocks[`${curr[0]}:${curr[1]}`] = nextEgress;
  lastEgress = nextEgress;
  switch (nextEgress) {
    case "UP":
      curr[0] -= 1;
      break;
    case "DOWN":
      curr[0] += 1;
      break;
    case "LEFT":
      curr[1] -= 1;
      break;
    case "RIGHT":
      curr[1] += 1;
      break;
    default:
      throw new Error("oh god oh fuck");
  }
}
console.log("Answer 1: " + steps / 2);

// const lookDirections = {
//   "DOWN": "RIGHT",
//   "RIGHT": "UP",
//   "UP": "LEFT",
//   "LEFT": "DOWN"
// };
const lookDirections = {
  DOWN: "LEFT",
  RIGHT: "DOWN",
  UP: "RIGHT",
  LEFT: "UP",
};

let nextMove, lastMove;
for (let entry of Object.entries(loopBlocks)) {
  const key = entry[0];
  nextMove = entry[1];
  const pos = key.split(":").map((num) => parseInt(num));
  const row = pos[0];
  const col = pos[1];
  const looks = [lookDirections[lastMove], lookDirections[nextMove]];
  lastMove = nextMove;
  grid[row][col] = "!";
  for (let look of looks) {
    if (!look) continue;
    if (look === "RIGHT" && grid[row][col + 1] && grid[row][col + 1] !== "!") {
      grid[row][col + 1] = "*";
    }
    if (look === "LEFT" && grid[row][col - 1] && grid[row][col - 1] !== "!") {
      grid[row][col - 1] = "*";
    }
    if (
      look === "DOWN" &&
      grid[row + 1]?.[col] &&
      grid[row + 1]?.[col] !== "!"
    ) {
      grid[row + 1][col] = "*";
    }
    if (look === "UP" && grid[row - 1]?.[col] && grid[row - 1]?.[col] !== "!") {
      grid[row - 1][col] = "*";
    }
  }
}

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[row][col] === "*") {
      floodFill(row, col);
    }
  }
}
let total = 0;
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[row][col] === "*") total++;
  }
}
console.log("Answer 2: " + total);
console.timeEnd('runtime');

function findStartingEgresses(row, col) {
  const egresses = [];
  const upEgress = "F7|";
  const downEgress = "|LJ";
  const leftEgress = "-LF";
  const rightEgress = "-J7";
  // up
  if (row > 0 && upEgress.includes(grid[row - 1][col])) {
    egresses.push("UP");
  }
  // down
  if (row < grid.length - 1 && downEgress.includes(grid[row + 1][col])) {
    egresses.push("DOWN");
  }
  // left
  if (col > 0 && leftEgress.includes(grid[row][col - 1])) {
    egresses.push("LEFT");
  }
  // right
  if (col < grid[0].length - 1 && rightEgress.includes(grid[row][col + 1])) {
    egresses.push("RIGHT");
  }
  return egresses;
}

function floodFill(row, col) {
  const neighbors = getNeighbors(row, col).filter((neighbor) => {
    const char = grid[neighbor[0]][neighbor[1]];
    return char !== "*" && char !== "!";
  });
  for (let neighbor of neighbors) {
    grid[neighbor[0]][neighbor[1]] = "*";
  }
  for (let neighbor of neighbors) {
    floodFill(neighbor[0], neighbor[1]);
  }
}

function getNeighbors(row, col) {
  const neighbors = [];
  if (row > 0) neighbors.push([row - 1, col]);
  if (row < grid.length - 1) neighbors.push([row + 1, col]);
  if (col > 0) neighbors.push([row, col - 1]);
  if (col < grid[0].length - 1) neighbors.push([row, col + 1]);
  return neighbors;
}
