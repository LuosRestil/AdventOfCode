import fs from "fs";
import path from "node:path";
import IntcodeComputer from "./intcode.js";

console.time();

const filename = "day15.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

let grid = Array(100)
  .fill(null)
  .map(() => Array(100).fill(3));
let startPos = { x: 25, y: 25 };
let pos = { x: 25, y: 25 };
let dirs = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];
let inputs = [4, 2, 3, 1];
let dirIdx = 0;

let computer = new IntcodeComputer(program, []);
computer.run();

let done = false;
let o2SysPos = null;
// hug the right wall
while (!done) {
  dirIdx++;
  if (dirIdx == dirs.length) dirIdx = 0;
  let moved = false;
  while (!moved) {
    computer.inputs.push(inputs[dirIdx]);
    computer.run();
    let output = computer.outputs.pop();
    grid[pos.y + dirs[dirIdx].y][pos.x + dirs[dirIdx].x] = output;
    if (output !== 0) {
      pos.x += dirs[dirIdx].x;
      pos.y += dirs[dirIdx].y;
      if (output === 2) {
        o2SysPos = {x: pos.x, y: pos.y};
      }
      moved = true;
      if (pos.x === startPos.x && pos.y === startPos.y) {
        done = true;
      }
    } else {
      dirIdx--;
      if (dirIdx === -1) dirIdx = dirs.length - 1;
    }
  }
}

console.log(`Part 1: ${bfs(startPos, o2SysPos)}`);
console.log(`Part 2: ${bfs(o2SysPos, {x: Infinity, y: Infinity})}`);

console.timeEnd();

function bfs(source, target) {
  let shortestDist = 0;
  let queue = [[source, 0]];
  let seen = { [source.y]: { [source.x]: true } };
  while (queue.length) {
    let curr = queue.shift();
    let currPos = curr[0];

    if (currPos.x === target.x && currPos.y === target.y) {
      shortestDist = curr[1];
      break;
    }
    let neighbors = [
      { x: currPos.x + 1, y: currPos.y },
      { x: currPos.x - 1, y: currPos.y },
      { x: currPos.x, y: currPos.y + 1 },
      { x: currPos.x, y: currPos.y - 1 },
    ];
    for (let neighbor of neighbors) {
      if (seen[neighbor.y]?.[neighbor.x]) continue;
      if (!seen[neighbor.y]) seen[neighbor.y] = {};
      seen[neighbor.y][neighbor.x] = true;
      if (grid[neighbor.y][neighbor.x]) {
        queue.push([neighbor, curr[1] + 1]);
      }
    }
    if (!queue.length) {
      return curr[1];
    }
  }
  return shortestDist;
}

// // bfs
// let shortestDist = 0;
// let queue = [[startPos, 0]];
// let seen = { [startPos.y]: { [startPos.x]: true } };
// while (queue.length) {
//   let curr = queue.shift();
//   let currPos = curr[0];

//   if (grid[currPos.y][currPos.x] === 2) {
//     shortestDist = curr[1];
//     break;
//   }
//   let neighbors = [
//     { x: currPos.x + 1, y: currPos.y },
//     { x: currPos.x - 1, y: currPos.y },
//     { x: currPos.x, y: currPos.y + 1 },
//     { x: currPos.x, y: currPos.y - 1 },
//   ];
//   for (let neighbor of neighbors) {
//     if (seen[neighbor.y]?.[neighbor.x]) continue;
//     if (!seen[neighbor.y]) seen[neighbor.y] = {};
//     seen[neighbor.y][neighbor.x] = true;
//     if (grid[neighbor.y][neighbor.x]) {
//       queue.push([neighbor, curr[1] + 1]);
//     }
//   }
// }

// console.log(shortestDist);