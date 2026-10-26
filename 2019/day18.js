import fs from "fs";
import path from "node:path";
import { gridIter } from "../utils.js";

console.time();

const filename = "day18.txt";

let grid = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row) => row.split(""));

let keys = {};
let doors = {};
let pos = { x: -1, y: -1 };
let inventory = new Set();

gridIter(grid, (x, y) => {
  let char = grid[y][x];
  let ascii = char.charCodeAt(0);
  if (ascii >= 97 && ascii <= 122) {
    keys[char] = { x, y };
    grid[y][x];
  } else if (ascii >= 65 && ascii <= 90) {
    doors[char] = { x, y };
  }
  if (char === "@") {
    pos = { x, y };
    grid[y][x] = ".";
  }
});

// pick a reachable key and play out the rest of the game from there, recursively, choosing the lowest steps?
// pass along your inventory to each step so you don't have to make any alterations to the board
console.log(collectKeys(pos, new Set(), 0));

function collectKeys(pos, inventory, steps) {
  if (inventory.size === Object.keys(keys).length) return steps;
  let reachableKeys = [];
  for (let key in keys) {
    if (inventory.has(key.charCodeAt(0))) continue;
    let shortest = aStarGrid(pos, keys[key], grid, inventory, steps);
    if (shortest !== null) {
      reachableKeys.push([key, shortest]);
    }
  }
  let min = Infinity;
  for (let key of reachableKeys) {
    let keyName = key[0];
    let keySteps = key[1];
    let newInv = new Set(inventory);
    newInv.add(keyName.charCodeAt(0));
    let newPos = {x: keys[keyName].x, y: keys[keyName].y};
    let cost = collectKeys(newPos, newInv, keySteps);
    if (cost < min) {
      min = cost;
    }
  }
  return min;
}

function aStarGrid(start, end, grid, inventory, startCost) {
  let openSet = [{ x: start.x, y: start.y, cost: startCost }];
  let closedSet = {};

  while (openSet.length) {
    let winnerIdx = 0;
    let winnerF = Infinity;
    for (let i = 0; i < openSet.length; i++) {
      let heuristic =
        Math.abs(openSet[i].x - end.x) + Math.abs(openSet[i].y - end.y);
      let f = openSet[i].cost + heuristic;
      if (f < winnerF) {
        winnerF = f;
        winnerIdx = i;
      }
    }
    let curr = openSet.splice(winnerIdx, 1)[0];

    if (curr.x === end.x && curr.y === end.y) {
      return curr.cost;
    }

    let currChar = grid[curr.y][curr.x];
    if (doors[currChar] && !inventory.has(currChar.charCodeAt(0) + 32)) {
      continue;
    }

    if (!closedSet[curr.y]) closedSet[curr.y] = {};
    closedSet[curr.y][curr.x] = true;

    let neighbors = [
      // move
      { y: curr.y - 1, x: curr.x, cost: curr.cost + 1 },
      { y: curr.y + 1, x: curr.x, cost: curr.cost + 1 },
      { y: curr.y, x: curr.x - 1, cost: curr.cost + 1 },
      { y: curr.y, x: curr.x + 1, cost: curr.cost + 1 },
    ];
    neighbors = neighbors.filter((neighbor) => {
      if (closedSet[neighbor.y]?.[neighbor.x]) return false;
      if (neighbor.y < 0 || neighbor.x < 0) return false;
      let char = grid[neighbor.y]?.[neighbor.x];
      return char !== undefined && char !== "#";
    });

    for (let neighbor of neighbors) {
      let existing = openSet.find(
        (elem) => elem.y === neighbor.y && elem.x === neighbor.x,
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
  return null;
}
