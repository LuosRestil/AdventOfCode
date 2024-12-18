import utils from "../utils.js";
import viz from "../terminalViz.js";

const doViz = process.argv[2] === "viz";

const posOffsets = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const maze = utils
  .getInput("day16.txt")
  .split("\n")
  .map((row) => row.split(""));

let startPos;
let endPos;
for (let i = 0; i < maze.length; i++) {
  for (let j = 0; j < maze[0].length; j++) {
    const char = maze[i][j];
    if (char === "S") startPos = [i, j];
    else if (char === "E") endPos = [i, j];
  }
}

const queue = [{ pos: startPos, dir: 1, cost: 0 }];
const startHashKey = utils.getHashKey(...startPos);
const seen = {[startHashKey]: [null, {cost: 0, from: []}]};

while (queue.length) {
  const next = queue.shift();
  const { pos, dir, cost } = next;
  const seenFromHashKey = utils.getHashKey(pos[0], pos[1], dir);
  if (utils.gridGetPos(maze, pos) === "E") {
    continue;
  }
  // look in dir
  const forwardPos = [pos[0] + posOffsets[dir][0], pos[1] + posOffsets[dir][1]];
  if (utils.gridGetPos(maze, forwardPos) !== "#") {
    const forwardHashKey = utils.getHashKey(forwardPos[0], forwardPos[1]);
    if (!seen[forwardHashKey]) {
      seen[forwardHashKey] = [];
    }
    if (!seen[forwardHashKey][dir]) {
      seen[forwardHashKey][dir] = { cost: Infinity, from: []}; 
    }
    const forwardCost = cost + 1;
    const seenVal = seen[forwardHashKey][dir];
    if (seenVal.cost > forwardCost) {
      seenVal.cost = forwardCost;
      seenVal.from = [seenFromHashKey];
      queue.push({pos: forwardPos, dir, cost: forwardCost});
    } else if (seenVal.cost === forwardCost) {
      seenVal.from.push(seenFromHashKey);
    }
  }

  // turn left
  const leftDir = utils.getPrevIdx(posOffsets, dir);
  const leftPos = [
    pos[0] + posOffsets[leftDir][0],
    pos[1] + posOffsets[leftDir][1],
  ];
  if (utils.gridGetPos(maze, leftPos) !== '#') {
    const leftHashKey = utils.getHashKey(pos[0], pos[1]);
    if (!seen[leftHashKey]) {
      seen[leftHashKey] = [];
    }
    if (!seen[leftHashKey][leftDir]) {
      seen[leftHashKey][leftDir] = {cost: Infinity, from: []};
    }
    const leftCost = cost + 1000;
    const seenVal = seen[leftHashKey][leftDir];
    if (seenVal.cost > leftCost) {
      seenVal.cost = leftCost;
      seenVal.from = [seenFromHashKey];
      queue.push({pos, dir: leftDir, cost: leftCost});
    } else if (seenVal.cost === leftCost) {
      seenVal.from.push(seenFromHashKey);
    }
  }

  // turn right
  const rightDir = utils.getNextIdx(posOffsets, dir);
  const rightPos = [
    pos[0] + posOffsets[rightDir][0],
    pos[1] + posOffsets[rightDir][1],
  ];
  if (utils.gridGetPos(maze, rightPos) !== '#') {
    const rightHashKey = utils.getHashKey(pos[0], pos[1]);
    if (!seen[rightHashKey]) {
      seen[rightHashKey] = [];
    }
    if (!seen[rightHashKey][rightDir]) {
      seen[rightHashKey][rightDir] = {cost: Infinity, from: []};
    }
    const rightCost = cost + 1000;
    const seenVal = seen[rightHashKey][rightDir];
    if (seenVal.cost > rightCost) {
      seenVal.cost = rightCost;
      seenVal.from = [seenFromHashKey];
      queue.push({pos, dir: rightDir, cost: rightCost});
    } else if (seenVal.cost === rightCost) {
      seenVal.from.push(seenFromHashKey);
    }
  }
}

const endHashKey = utils.getHashKey(endPos[0], endPos[1]);
let lowestCost = Infinity;
let lowestCostDir = -1;
for (let i = 0; i < seen[endHashKey].length; i++) {
  if (seen[endHashKey][i] && seen[endHashKey][i].cost < lowestCost) {
    lowestCostDir = i;
    lowestCost = seen[endHashKey][i].cost;
  }
}

console.log(`Part 1: ${lowestCost}`);
console.log(`Part 2: ${countPath(endHashKey, lowestCostDir)}`);

function countPath(startKey, startDir) {
  const found = new Set();
  const queue = [{key: startKey, dir: startDir}];
  while (queue.length) {
    const {key, dir} = queue.pop();
    found.add(key);
    const entry = seen[key][dir];
    for (let f of entry.from) {
      const [fRow, fCol, fDirStr] = f.split(':');
      const fDir = Number(fDirStr);
      const fKey = utils.getHashKey(fRow, fCol);
      queue.push({key: fKey, dir: fDir});
    }
  }
  return found.size;
}