// remaining hp: 2809
// iters: 74
// Part 1: 207866 TOO LOW
// check for off-by-one error by bumping iters to 75
// Part 1: 210675 STILL TOO LOW

import fs from "fs";
import path from "node:path";

console.time();

let grid;
let entities;
let iters;

console.log("Part 1");
console.log(run(3));
console.log("Part 2");
console.log(run(25));

console.timeEnd();

function run(elfAttackPower) {
  grid = getGrid("day15.txt");
  entities = getEntities(elfAttackPower);
  iters = 0;
  let startElfCount = entities.filter((e) => e.type === "E").length;
  let done = false;

  while (!done) {
    done = tick();
  }

  entities = entities.filter((entity) => entity.hp > 0);
  let remainingHp = entities.reduce((acc, curr) => acc + curr.hp, 0);
  let endElfCount = entities.filter((e) => e.type === "E").length;
  return {
    remainingHp,
    iters,
    score: iters * remainingHp,
    startElfCount,
    endElfCount,
  };
}

function tick() {
  // sort entities in reading order
  entities.sort((a, b) => (a.row === b.row ? a.col - b.col : a.row - b.row));
  // for each entity
  for (let entity of entities) {
    if (entity.hp <= 0) continue;
    // get adjacent enemies
    let adjacentEnemies = getAdjacentEnemies(entity);
    if (!adjacentEnemies.length) {
      // get enemies
      let enemies = getAllEnemies(entity);
      // if no enemies, we're done
      if (!enemies.length) return true;
      // get cells adjacent to enemies
      let cells = getCellsAdjacentToEnemies(enemies);
      // get shortest paths to each cell
      let shortestDist = Infinity;
      let nearestCells = [];
      for (let cell of cells) {
        let dist = getShortestDistance(entity, cell);
        if (dist === null) continue;
        if (dist < shortestDist) {
          nearestCells = [cell];
          shortestDist = dist;
        } else if (dist === shortestDist) {
          nearestCells.push(cell);
        }
      }
      if (!nearestCells.length) continue;
      nearestCells.sort((a, b) =>
        a.row === b.row ? a.col - b.col : a.row - b.row,
      );
      let destination = nearestCells[0];
      let neighbors = [
        // reading order
        { row: entity.row - 1, col: entity.col }, // up
        { row: entity.row, col: entity.col - 1 }, // left
        { row: entity.row, col: entity.col + 1 }, // right
        { row: entity.row + 1, col: entity.col }, // down
      ];
      let move = null;
      for (let neighbor of neighbors) {
        if (grid[neighbor.row][neighbor.col] !== ".") {
          continue;
        }
        let dist = getShortestDistance(neighbor, destination);
        if (dist === shortestDist - 1) {
          move = neighbor;
          break;
        }
      }
      // move to first step of first path
      grid[entity.row][entity.col] = ".";
      entity.row = move.row;
      entity.col = move.col;
      grid[entity.row][entity.col] = entity.type;
      // recheck for adjacent enemies
      adjacentEnemies = getAdjacentEnemies(entity, enemies);
    }
    // if no enemies are adjacent
    if (!adjacentEnemies.length) continue;
    // sort adjacent enemies by hp, then reading order
    adjacentEnemies.sort((a, b) => {
      if (a.hp === b.hp) {
        if (a.row === b.row) {
          return a.col - b.col;
        }
        return a.row - b.row;
      }
      return a.hp - b.hp;
    });
    // attack first adjacent enemy
    let target = adjacentEnemies[0];
    target.hp -= entity.power;
    if (target.hp <= 0) {
      grid[target.row][target.col] = ".";
    }
  }

  entities = entities.filter((entity) => entity.hp > 0);
  iters++;
  return false;
}

function getAllEnemies(entity) {
  let enemies = [];
  for (let other of entities) {
    if (other.hp <= 0) continue;
    if (entity.type !== other.type) {
      enemies.push(other);
    }
  }
  return enemies;
}

function getAdjacentEnemies(entity) {
  let adjacentEnemies = [
    entities.find((e) => e.row === entity.row - 1 && e.col === entity.col),
    entities.find((e) => e.row === entity.row + 1 && e.col === entity.col),
    entities.find((e) => e.row === entity.row && e.col === entity.col - 1),
    entities.find((e) => e.row === entity.row && e.col === entity.col + 1),
  ].filter((e) => e?.hp > 0 && e.type !== entity.type);
  return adjacentEnemies;
}

function getCellsAdjacentToEnemies(enemies) {
  let cells = [];
  for (let enemy of enemies) {
    // up
    if (grid[enemy.row - 1][enemy.col] === ".") {
      cells.push({ row: enemy.row - 1, col: enemy.col });
    }
    // down
    if (grid[enemy.row + 1][enemy.col] === ".") {
      cells.push({ row: enemy.row + 1, col: enemy.col });
    }
    // left
    if (grid[enemy.row][enemy.col - 1] === ".") {
      cells.push({ row: enemy.row, col: enemy.col - 1 });
    }
    // right
    if (grid[enemy.row][enemy.col + 1] === ".") {
      cells.push({ row: enemy.row, col: enemy.col + 1 });
    }
  }
  return cells;
}

function getGrid(file) {
  return fs
    .readFileSync(path.join(import.meta.dirname, "inputs", file), "utf-8")
    .split("\n")
    .map((row) => row.split(""));
}

function getEntities(elfAttackPower) {
  let entities = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      let char = grid[row][col];
      if (char === "G" || char === "E") {
        entities.push({
          row,
          col,
          hp: 200,
          power: char === "G" ? 3 : elfAttackPower,
          type: char,
        });
      }
    }
  }
  return entities;
}

function printGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    console.log(grid[i].join(""));
  }
}

function getShortestDistance(src, dest) {
  let openSet = [{ row: src.row, col: src.col, from: [], depth: 0 }];
  let closedSet = {};
  while (openSet.length) {
    let winner = 0;
    let winnerF = Infinity;
    for (let i = 0; i < openSet.length; i++) {
      let f = openSet[i].depth + manhattanDistance(openSet[i], dest);
      if (f < winnerF) {
        winnerF = f;
        winner = i;
      }
    }
    let curr = openSet.splice(winner, 1)[0];

    if (curr.row === dest.row && curr.col === dest.col) {
      return curr.depth;
    }

    if (!closedSet[curr.row]) closedSet[curr.row] = {};
    closedSet[curr.row][curr.col] = true;

    let neighbors = [
      { row: curr.row - 1, col: curr.col },
      { row: curr.row + 1, col: curr.col },
      { row: curr.row, col: curr.col - 1 },
      { row: curr.row, col: curr.col + 1 },
    ];
    for (let neighbor of neighbors) {
      let char = grid[neighbor.row][neighbor.col];
      if (char !== ".") {
        continue;
      }
      if (closedSet[neighbor.row]?.[neighbor.col]) continue;
      neighbor.depth = curr.depth + 1;
      neighbor.from = curr;
      let existing = openSet.find(
        (elem) => elem.row === neighbor.row && elem.col === neighbor.col,
      );
      if (existing) {
        if (neighbor.depth < existing.depth) {
          existing.depth = neighbor.depth;
          existing.from = curr;
        }
      } else {
        openSet.push(neighbor);
      }
    }
  }
  return null;
}

function manhattanDistance(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}
