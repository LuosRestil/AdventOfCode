console.time();

// read input, create 2d array of numbers
import { getHashKey, getInput } from "../utils.js";
const input = getInput("day17.txt");
const grid = input
  .split("\n")
  .map((row) => row.split("").map((val) => parseInt(val)));

const p1Res = solve(grid, getNeighborsPt1);
console.log(`Part 1: ${p1Res.cost}`);
// printPath(p1Res, JSON.parse(JSON.stringify(grid)));
const p2Res = solve(grid, getNeighborsPt2);
console.log(`Part 2: ${p2Res.cost}`);
// printPath(p2Res, JSON.parse(JSON.stringify(grid)));

function solve(grid, getNeighborFunc) {
  // initial state
  let curr;
  let queue = [];
  let visited = {};
  let goal = { row: grid.length - 1, col: grid[0].length - 1 };
  let start = { row: 0, col: 0, cost: 0, dir: null, dirCount: 0, from: null };
  queue.push(start);
  visited[getHashKey(start.row, start.col, start.dif, start.dirCount)] = start;

  // dijkstra
  while (queue.length) {
    let lci = lowestCostIdx(queue);
    curr = queue.splice(lci, 1)[0];
    if (curr.row === goal.row && curr.col === goal.col) break;
    let neighbors = getNeighborFunc(curr);
    for (const neighbor of neighbors) {
      let hashKey = getHashKey(
        neighbor.row,
        neighbor.col,
        neighbor.dir,
        neighbor.dirCount
      );
      let visitedEntry = visited[hashKey];
      if (!visitedEntry || neighbor.cost < visitedEntry.cost) {
        queue.push(neighbor);
        visited[hashKey] = neighbor;
      }
    }
  }
  return curr;
}

console.timeEnd();

function getNeighborsPt1(node) {
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
  neighbors = neighbors.filter((neighbor) => neighbor.dirCount <= 3);
  return neighbors;
}

function getNeighborsPt2(node) {
  let neighbors = [];
  // continue in current direction
  if (node.dirCount !== 0 && node.dirCount < 10) {
    try {
      let row =
        node.row + (node.dir === "up" ? -1 : node.dir === "down" ? 1 : 0);
      let col =
        node.col + (node.dir === "left" ? -1 : node.dir === "right" ? 1 : 0);
      neighbors.push({
        row,
        col,
        cost: grid[row][col] + node.cost,
        dir: node.dir,
        dirCount: node.dirCount + 1,
        from: node,
      });
    } catch {}
  }

  // turn
  let dirs = ["up", "down", "left", "right"];
  for (let dir of dirs) {
    if (
      !node.dir ||
      ((dir === "up" || dir === "down") &&
        (node.dir === "left" || node.dir === "right")) ||
      ((dir === "left" || dir === "right") &&
        (node.dir === "up" || node.dir === "down"))
    ) {
      try {
        let neighbor = {
          row: node.row,
          col: node.col,
          cost: node.cost,
          dir,
          dirCount: 0,
          from: node,
        };
        while (neighbor.dirCount < 4) {
          neighbor.row += dir === "up" ? -1 : dir === "down" ? 1 : 0;
          neighbor.col += dir === "left" ? -1 : dir === "right" ? 1 : 0;
          neighbor.cost += grid[neighbor.row][neighbor.col];
          neighbor.dirCount++;
        }
        neighbors.push(neighbor);
      } catch {}
    }
  }

  neighbors = neighbors.filter((neighbor) => !Number.isNaN(neighbor.cost));
  return neighbors;
}

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

function printPath(node, grid) {
  const dirSymbols = {
    up: "^",
    down: "V",
    left: "<",
    right: ">",
  };
  while (node.from !== null) {
    while (node.row !== node.from.row || node.col !== node.from.col) {
      grid[node.row][node.col] = dirSymbols[node.dir];
      node.row += node.dir === "up" ? 1 : node.dir === "down" ? -1 : 0;
      node.col += node.dir === "left" ? 1 : node.dir === "right" ? -1 : 0;
      grid[node.row][node.col] = dirSymbols[node.dir];
    }
    node = node.from;
  }
  let special = new Set(["^", "V", "<", ">"]);
  for (let row of grid) {
    for (let char of row) {
      if (special.has(char)) process.stdout.write("\x1b[35m");
      process.stdout.write(char.toString());
      process.stdout.write("\x1b[0m");
    }
    process.stdout.write("\n");
  }
}
