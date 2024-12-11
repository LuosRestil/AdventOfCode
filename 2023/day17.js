// read input, create 2d array of numbers
const fs = require("fs");
const input = fs.readFileSync("inputs/day17.txt", { encoding: "utf-8" });
const grid = input
  .split("\n")
  .map((row) => row.split("").map((val) => parseInt(val)));

// mapping directions to symbols to draw result later
const dirSymbols = {
  up: "^",
  down: "V",
  left: "<",
  right: ">",
};

// initial state
let curr;
let queue = [];
let visited = {};
let goal = {row: grid.length - 1, col: grid[0].length - 1};
let start = { row: 0, col: 0, cost: 0, dir: null, dirCount: 0, from: null };
queue.push(start);
visited[`${start.row}:${start.col}:${start.dir}:${start.dirCount}`] = start;

// dijkstra
while (queue.length) {
  let idx = lowestCostIdx(queue);
  curr = queue.splice(idx, 1)[0];
  if (curr.row === goal.row && curr.col === goal.col) break;
  let neighbors = getNeighbors(curr);
  for (const neighbor of neighbors) {
    if (neighbor.dirCount > 3) continue;
    let visitedEntry = visited[`${neighbor.row}:${neighbor.col}:${neighbor.dir}:${neighbor.dirCount}`];
    if (!visitedEntry || neighbor.cost < visitedEntry.cost) {
      queue.push(neighbor);
      visited[`${neighbor.row}:${neighbor.col}:${neighbor.dir}:${neighbor.dirCount}`] = neighbor;
    }
  };
}
console.log(
  "Answer 1: " + curr.cost
);

while (curr.from !== null) {
  grid[curr.row][curr.col] = dirSymbols[curr.dir];
  curr = curr.from;
}
grid.forEach((row) => console.log(row.join("")));


function getNeighbors(node) {
  let neighbors = [];
  // up
  if (node.row > 0 && node.dir !== "down")
    neighbors.push({
      row: node.row - 1,
      col: node.col,
      cost: grid[node.row - 1][node.col] + node.cost,
      dir: "up",
      dirCount: node.dir === "up" ? node.dirCount + 1 : 1,
      from: node,
    });
  // down
  if (node.row < grid.length - 1 && node.dir !== "up")
    neighbors.push({
      row: node.row + 1,
      col: node.col,
      cost: grid[node.row + 1][node.col] + node.cost,
      dir: "down",
      dirCount: node.dir === "down" ? node.dirCount + 1 : 1,
      from: node,
    });
  // left
  if (node.col > 0 && node.dir !== "right")
    neighbors.push({
      row: node.row,
      col: node.col - 1,
      cost: grid[node.row][node.col - 1] + node.cost,
      dir: "left",
      dirCount: node.dir === "left" ? node.dirCount + 1 : 1,
      from: node,
    });
  // right
  if (node.col < grid[0].length - 1 && node.dir !== "left")
    neighbors.push({
      row: node.row,
      col: node.col + 1,
      cost: grid[node.row][node.col + 1] + node.cost,
      dir: "right",
      dirCount: node.dir === "right" ? node.dirCount + 1 : 1,
      from: node,
    });
  return neighbors;
}

// function countConsecutiveDir(node) {
//   let count = 1;
//   while (node.from?.dir === node.dir) {
//     count++;
//     node = node.from;
//   }
//   return count;
// }

function lowestCostIdx(queue) {
  let min = Infinity;
  let idx = -1;
  for (let i = 0; i < queue.length; i++) {
    if (queue[i].cost < min) {
      min = queue[i].cost;
      idx = i;
    }
  }
  return idx;
}