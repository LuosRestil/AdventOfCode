import fs from "fs";
import path from "node:path";

let grid = getGrid("day15.txt");
let entities = getEntities();
let iters = 0;
let done = false;
// console.log();
// console.log(iters);
// console.log();
while (!done) {
  done = tick();
  // console.log();
  // console.log(iters);
  // console.log();
  // printGrid(grid);
}

entities = entities.filter((entity) => entity.hp > 0);
let remainingHp = entities.reduce((acc, curr) => acc + curr.hp, 0);
console.log(`remaining hp: ${remainingHp}`);
console.log(`iters: ${iters}`);
console.log(`Part 1: ${iters * remainingHp}`);
printGrid(grid);

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
      let shortestPaths = [];
      let shortestLen = Infinity;
      for (let cell of cells) {
        let cellShortestPaths = getShortestPaths(
          { row: entity.row, col: entity.col },
          cell,
        );
        if (!cellShortestPaths.length) continue;
        let len = cellShortestPaths[0].length;
        if (len < shortestLen) {
          shortestLen = len;
          shortestPaths = cellShortestPaths;
        } else if (len === shortestLen) {
          for (let path of cellShortestPaths) {
            shortestPaths.push(path);
          }
        }
      }
      if (!shortestPaths.length) continue;
      // sort shortest paths by first step in reading order
      shortestPaths.sort((a, b) =>
        a[1].row === b[1].row ? a[1].col - b[1].col : a[1].row - b[1].row,
      );
      let destination = shortestPaths[0][1];
      // move to first step of first path
      grid[entity.row][entity.col] = ".";
      entity.row = destination.row;
      entity.col = destination.col;
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

function getEntities() {
  let entities = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      let char = grid[row][col];
      if (char === "G" || char === "E") {
        entities.push({ row, col, hp: 200, power: 3, type: char });
      }
    }
  }
  return entities;
}

function getShortestPaths(src, dest) {
  let res = [];
  let queue = [{ loc: src, from: null }];
  while (queue.length) {
    let step = queue.shift();
    if (step.loc.row === dest.row && step.loc.col === dest.col) {
      res.push(getPath(step));
      continue;
    }
    if (res.length && getPath(step).length >= res[0].length) {
      continue;
    }
    let neighbors = [
      { loc: { row: step.loc.row - 1, col: step.loc.col }, from: step },
      { loc: { row: step.loc.row + 1, col: step.loc.col }, from: step },
      { loc: { row: step.loc.row, col: step.loc.col - 1 }, from: step },
      { loc: { row: step.loc.row, col: step.loc.col + 1 }, from: step },
    ];
    for (let neighbor of neighbors) {
      let open =
        grid[neighbor.loc.row][neighbor.loc.col] === "." ||
        (neighbor.loc.row === dest.row && neighbor.loc.col === dest.col);
      let seen = getPath(neighbor)
        .slice(0, -1)
        .find(
          (loc) => loc.row === neighbor.loc.row && loc.col === neighbor.loc.col,
        );
      if (open && !seen) {
        queue.push(neighbor);
      }
    }
  }
  return res;
}

function getPath(node) {
  let path = [node.loc];
  while (node.from) {
    node = node.from;
    path.push(node.loc);
  }
  path.reverse();
  return path;
}

function printGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    console.log(grid[i].join(""));
  }
}
