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

let numKeys = Object.keys(keys).length;

// console.log(`Part 1: ${dijkstraStates(pos)}`);

grid[pos.y - 1][pos.x] = "#";
grid[pos.y + 1][pos.x] = "#";
grid[pos.y][pos.x - 1] = "#";
grid[pos.y][pos.x + 1] = "#";

let posList = [
  { x: pos.x - 1, y: pos.y - 1 },
  { x: pos.x - 1, y: pos.y + 1 },
  { x: pos.x + 1, y: pos.y - 1 },
  { x: pos.x + 1, y: pos.y + 1 },
];
for (let pos of posList) {
  grid[pos.y][pos.x] = '.';
}

console.log(`Part 2: ${dijkstraStates2(posList)}`);

console.timeEnd();

function dijkstraStates(startPos) {
  let openSet = [{ x: startPos.x, y: startPos.y, invStr: "", cost: 0 }];
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

    let stateInvList = curr.invStr
      ? curr.invStr.split(",").map((num) => parseInt(num))
      : [];
    let state = {
      x: curr.x,
      y: curr.y,
      invStr: curr.invStr,
      invList: stateInvList,
      invSet: new Set(stateInvList),
      cost: curr.cost,
    };

    if (state.invSet.size === numKeys) {
      return curr.cost;
    }

    if (!closedSet[state.y]) closedSet[state.y] = {};
    if (!closedSet[state.y][state.x]) closedSet[state.y][state.x] = {};
    closedSet[state.y][state.x][state.invStr] = true;

    let neighbors = [];
    let reachableKeys = [];
    for (let key in keys) {
      if (state.invSet.has(key.charCodeAt(0))) continue;
      let shortest = aStarGrid(
        { x: state.x, y: state.y },
        keys[key],
        grid,
        state.invSet,
        0,
      );
      if (shortest !== null) {
        reachableKeys.push([key, shortest]);
      }
    }
    for (let key of reachableKeys) {
      let newInv = [...state.invList, key[0].charCodeAt(0)].toSorted(
        (a, b) => a - b,
      );
      neighbors.push({
        x: keys[key[0]].x,
        y: keys[key[0]].y,
        invStr: newInv.join(","),
        cost: state.cost + key[1],
      });
    }

    neighbors = neighbors.filter(
      (neighbor) => !closedSet[neighbor.y]?.[neighbor.x]?.[neighbor.invStr],
    );

    for (let neighbor of neighbors) {
      let existing = openSet.find(
        (elem) =>
          elem.y === neighbor.y &&
          elem.x === neighbor.x &&
          elem.invStr === neighbor.invStr,
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

function dijkstraStates2(posList) {
  let openSet = [
    {
      x0: posList[0].x,
      y0: posList[0].y,
      x1: posList[1].x,
      y1: posList[1].y,
      x2: posList[2].x,
      y2: posList[2].y,
      x3: posList[3].x,
      y3: posList[3].y,
      invStr: "",
      cost: 0,
    },
  ];
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

    let stateInvList = curr.invStr
      ? curr.invStr.split(",").map((num) => parseInt(num))
      : [];
    let state = {
      x0: curr.x0,
      y0: curr.y0,
      x1: curr.x1,
      y1: curr.y1,
      x2: curr.x2,
      y2: curr.y2,
      x3: curr.x3,
      y3: curr.y3,
      invStr: curr.invStr,
      invList: stateInvList,
      invSet: new Set(stateInvList),
      cost: curr.cost,
      posList: [
        { x: curr.x0, y: curr.y0 },
        { x: curr.x1, y: curr.y1 },
        { x: curr.x2, y: curr.y2 },
        { x: curr.x3, y: curr.y3 },
      ],
    };

    if (state.invSet.size === numKeys) {
      return curr.cost;
    }

    if (!closedSet[state.y0]) closedSet[state.y0] = {};
    if (!closedSet[state.y0][state.x0]) closedSet[state.y0][state.x0] = {};
    if (!closedSet[state.y0][state.x0][state.y1])
      closedSet[state.y0][state.x0][state.y1] = {};
    if (!closedSet[state.y0][state.x0][state.y1][state.x1])
      closedSet[state.y0][state.x0][state.y1][state.x1] = {};
    if (!closedSet[state.y0][state.x0][state.y1][state.x1][state.y2])
      closedSet[state.y0][state.x0][state.y1][state.x1][state.y2] = {};
    if (!closedSet[state.y0][state.x0][state.y1][state.x1][state.y2][state.x2])
      closedSet[state.y0][state.x0][state.y1][state.x1][state.y2][state.x2] =
        {};
    if (
      !closedSet[state.y0][state.x0][state.y1][state.x1][state.y2][state.x2][
        state.y3
      ]
    )
      closedSet[state.y0][state.x0][state.y1][state.x1][state.y2][state.x2][
        state.y3
      ] = {};
    if (
      !closedSet[state.y0][state.x0][state.y1][state.x1][state.y2][state.x2][
        state.y3
      ][state.x3]
    )
      closedSet[state.y0][state.x0][state.y1][state.x1][state.y2][state.x2][
        state.y3
      ][state.x3] = {};
    closedSet[state.y0][state.x0][state.y1][state.x1][state.y2][state.x2][
      state.y3
    ][state.x3] = true;

    let neighbors = [];
    for (let i = 0; i < state.posList.length; i++) {
      let pos = state.posList[i];
      let reachableKeys = [];
      for (let key in keys) {
        if (state.invSet.has(key.charCodeAt(0))) continue;
        let shortest = aStarGrid(
          { x: pos.x, y: pos.y },
          keys[key],
          grid,
          state.invSet,
          0,
        );
        if (shortest !== null) {
          reachableKeys.push([key, shortest]);
        }
      }
      for (let key of reachableKeys) {
        let newInv = [...state.invList, key[0].charCodeAt(0)].toSorted(
          (a, b) => a - b,
        );
        neighbors.push({
          x0: i === 0 ? keys[key[0]].x : state.x0,
          y0: i === 0 ? keys[key[0]].y : state.y0,
          x1: i === 1 ? keys[key[0]].x : state.x1,
          y1: i === 1 ? keys[key[0]].y : state.y1,
          x2: i === 2 ? keys[key[0]].x : state.x2,
          y2: i === 2 ? keys[key[0]].y : state.y2,
          x3: i === 3 ? keys[key[0]].x : state.x3,
          y3: i === 3 ? keys[key[0]].y : state.y3,
          invStr: newInv.join(","),
          cost: state.cost + key[1],
        });
      }
    }

    neighbors = neighbors.filter(
      (neighbor) =>
        !closedSet[state.y0]?.[state.x0]?.[state.y1]?.[state.x1]?.[state.y2]?.[
          state.x2
        ]?.[state.y3]?.[state.x3]?.[neighbor.invStr],
    );

    for (let neighbor of neighbors) {
      let existing = openSet.find(
        (elem) =>
          elem.y0 === neighbor.y0 &&
          elem.x0 === neighbor.x0 &&
          elem.y1 === neighbor.y1 &&
          elem.x1 === neighbor.x1 &&
          elem.y2 === neighbor.y2 &&
          elem.x2 === neighbor.x2 &&
          elem.y3 === neighbor.y3 &&
          elem.x3 === neighbor.x3 &&
          elem.invStr === neighbor.invStr,
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

function keyifyState(pos, inventory) {
  return `${pos.x}:${pos.y}:${JSON.stringify([...inventory].toSorted((a, b) => a - b))}`;
}
