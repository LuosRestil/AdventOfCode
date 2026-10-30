import fs from "fs";
import path from "node:path";

console.time();

const filename = "day20.txt";

let grid = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row) => row.split(""));
let { portalsByName, portalsByPosition } = mapPortals(grid);
console.log(
  `Part 1: ${dijkstra(portalsByName["AA"].outer, portalsByName["ZZ"].outer)}`,
);
console.log(
  `Part 2: ${dijkstra2(portalsByName["AA"].outer, portalsByName["ZZ"].outer)}`,
);

console.timeEnd();

function dijkstra(start, end) {
  let openSet = [{ x: start.x, y: start.y, cost: 0 }];
  let closedSet = {};

  while (openSet.length) {
    let winnerIdx = 0;
    let winnerCost = Infinity;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].cost < winnerCost) {
        winnerCost = openSet[i].cost;
        winnerIdx = i;
      }
    }
    let curr = openSet.splice(winnerIdx, 1)[0];

    if (curr.x === end.x && curr.y === end.y) {
      return curr.cost;
    }

    if (!closedSet[curr.y]) closedSet[curr.y] = {};
    closedSet[curr.y][curr.x] = true;

    let neighbors = [
      { x: curr.x + 1, y: curr.y, cost: curr.cost + 1 },
      { x: curr.x - 1, y: curr.y, cost: curr.cost + 1 },
      { x: curr.x, y: curr.y + 1, cost: curr.cost + 1 },
      { x: curr.x, y: curr.y - 1, cost: curr.cost + 1 },
    ];
    // teleport if on teleport pad
    for (let neighbor of neighbors) {
      let portalName = portalsByPosition[neighbor.y]?.[neighbor.x];
      let portalPositions = portalsByName[portalName];
      if (portalPositions?.inner && portalPositions?.outer) {
        if (
          portalPositions.inner.x === neighbor.x &&
          portalPositions.inner.y === neighbor.y
        ) {
          neighbor.x = portalPositions.outer.x;
          neighbor.y = portalPositions.outer.y;
          neighbor.cost += 1;
        } else if (
          portalPositions.outer.x === neighbor.x &&
          portalPositions.outer.y === neighbor.y
        ) {
          neighbor.x = portalPositions.inner.x;
          neighbor.y = portalPositions.inner.y;
          neighbor.cost += 1;
        }
      }
    }

    neighbors = neighbors.filter(
      (neighbor) =>
        grid[neighbor.y]?.[neighbor.x] === "." &&
        !closedSet[neighbor.y]?.[neighbor.x],
    );

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

function dijkstra2(start, end) {
  let openSet = [{ x: start.x, y: start.y, level: 0, cost: 0 }];
  let closedSet = {};

  while (openSet.length) {
    let winnerIdx = 0;
    let winnerCost = Infinity;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].cost < winnerCost) {
        winnerCost = openSet[i].cost;
        winnerIdx = i;
      }
    }
    let curr = openSet.splice(winnerIdx, 1)[0];

    if (curr.x === end.x && curr.y === end.y) {
      return curr.cost;
    }

    if (!closedSet[curr.y]) closedSet[curr.y] = {};
    if (!closedSet[curr.y][curr.x]) closedSet[curr.y][curr.x] = {};
    closedSet[curr.y][curr.x][curr.level] = true;

    let neighbors = [
      { x: curr.x + 1, y: curr.y, level: curr.level, cost: curr.cost + 1 },
      { x: curr.x - 1, y: curr.y, level: curr.level, cost: curr.cost + 1 },
      { x: curr.x, y: curr.y + 1, level: curr.level, cost: curr.cost + 1 },
      { x: curr.x, y: curr.y - 1, level: curr.level, cost: curr.cost + 1 },
    ];
    // teleport if on teleport pad
    for (let neighbor of neighbors) {
      let portalName = portalsByPosition[neighbor.y]?.[neighbor.x];
      let portalPositions = portalsByName[portalName];
      if (portalPositions?.inner && portalPositions?.outer) {
        if (
          portalPositions.inner.x === neighbor.x &&
          portalPositions.inner.y === neighbor.y
        ) {
          neighbor.x = portalPositions.outer.x;
          neighbor.y = portalPositions.outer.y;
          neighbor.level++;
          neighbor.cost++;
        } else if (
          portalPositions.outer.x === neighbor.x &&
          portalPositions.outer.y === neighbor.y
        ) {
          neighbor.x = portalPositions.inner.x;
          neighbor.y = portalPositions.inner.y;
          neighbor.cost++;
          neighbor.level--;
        }
      }
    }

    neighbors = neighbors.filter(
      (neighbor) =>
        grid[neighbor.y]?.[neighbor.x] === "." &&
        !closedSet[neighbor.y]?.[neighbor.x]?.[neighbor.level] &&
        !(neighbor.x === end.x && neighbor.y === end.y && neighbor.level) &&
        neighbor.level >= 0,
    );

    for (let neighbor of neighbors) {
      let existing = openSet.find(
        (elem) =>
          elem.y === neighbor.y &&
          elem.x === neighbor.x &&
          elem.level === neighbor.level,
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

function mapPortals(grid) {
  // find all the portals
  let portalsByName = {};
  let portalsByPosition = {};
  // top and bottom
  for (let x = 2; x < grid[0].length - 2; x++) {
    if (grid[2][x] === ".") {
      let name = grid[0][x] + grid[1][x];
      recordPortal(name, 2, x, "outer", portalsByName, portalsByPosition);
    }
    if (grid[grid.length - 3][x] === ".") {
      let name = grid[grid.length - 2][x] + grid[grid.length - 1][x];
      recordPortal(
        name,
        grid.length - 3,
        x,
        "outer",
        portalsByName,
        portalsByPosition,
      );
    }
  }
  // left and right
  for (let y = 2; y < grid.length; y++) {
    if (grid[y][2] === ".") {
      let name = grid[y][0] + grid[y][1];
      recordPortal(name, y, 2, "outer", portalsByName, portalsByPosition);
    }
    if (grid[y][grid[0].length - 3] === ".") {
      let name = grid[y][grid[0].length - 2] + grid[y][grid[0].length - 1];
      recordPortal(
        name,
        y,
        grid[0].length - 3,
        "outer",
        portalsByName,
        portalsByPosition,
      );
    }
  }
  // then find the inner ring
  let i = 2;
  while (grid[i][i] !== " ") {
    i++;
  }
  // and do the same for the inner ring
  let x = i;
  // top
  while (grid[i][x] !== "#") {
    if (grid[i - 1][x] === ".") {
      let name = grid[i][x] + grid[i + 1][x];
      recordPortal(name, i - 1, x, "inner", portalsByName, portalsByPosition);
    }
    x++;
  }
  let rightX = --x;
  // left and right
  let y = i;
  while (grid[y][i] !== "#") {
    if (grid[y][i - 1] === ".") {
      let name = grid[y][i] + grid[y][i + 1];
      recordPortal(name, y, i - 1, "inner", portalsByName, portalsByPosition);
    }
    if (grid[y][rightX + 1] === ".") {
      let name = grid[y][rightX - 1] + grid[y][rightX];
      recordPortal(
        name,
        y,
        rightX + 1,
        "inner",
        portalsByName,
        portalsByPosition,
      );
    }
    y++;
  }
  let bottomY = --y;
  // bottom
  x = i;
  while (grid[bottomY][x] !== "#") {
    if (grid[bottomY + 1][x] === ".") {
      let name = grid[bottomY - 1][x] + grid[bottomY][x];
      recordPortal(
        name,
        bottomY + 1,
        x,
        "inner",
        portalsByName,
        portalsByPosition,
      );
    }
    x++;
  }
  return { portalsByName, portalsByPosition };
}

function recordPortal(name, y, x, position, portalsByName, portalsByPosition) {
  if (!portalsByName[name]) portalsByName[name] = {};
  if (!portalsByPosition[y]) portalsByPosition[y] = {};
  portalsByName[name][position] = { x, y };
  portalsByPosition[y][x] = name;
}
