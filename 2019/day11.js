import fs from "fs";
import path from "node:path";
import IntcodeComputer from "./intcode.js";

console.time();

const filename = "day11.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

let dirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

let panel = Array(500)
  .fill(null)
  .map(() => Array(500).fill(0));
runProgram(panel, 0, 1);
panel = Array(500)
  .fill(null)
  .map(() => Array(500).fill(0));
runProgram(panel, 1, 2);
console.log("Part 2:");
focusPanel(panel).forEach((row) =>
  console.log(row.map((num) => (num ? "⬜" : "⬛")).join("")),
);

console.timeEnd();

function runProgram(panel, startingColor, part) {
  let dir = 0;
  let pos = [250, 250];
  panel[pos[1]][pos[0]] = startingColor;
  let painted = new Set();
  let computer = new IntcodeComputer(program, []);
  while (computer.status !== IntcodeComputer.STATUS_DONE) {
    computer.inputs.push(panel[pos[1]][pos[0]]);
    computer.run();

    let paintOutput = computer.outputs.shift();
    panel[pos[1]][pos[0]] = paintOutput;
    painted.add(`${pos[0]}:${pos[1]}`);

    let moveOutput = computer.outputs.shift();
    if (moveOutput === 0) {
      dir--;
    } else {
      dir++;
    }
    if (dir < 0) dir = 3;
    if (dir > 3) dir = 0;
    pos[0] += dirs[dir][0];
    pos[1] += dirs[dir][1];
    if (
      pos[0] < 0 ||
      pos[0] >= panel[0].length ||
      pos[1] < 0 ||
      pos[1] >= panel.length
    ) {
      throw new Error("out of bounds");
    }
  }
  if (part === 1) {
    console.log(`Part 1: ${painted.size}`);
  }
}

function focusPanel(panel) {
  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
  for (let y = 0; y < panel.length; y++) {
    for (let x = 0; x < panel[0].length; x++) {
      let dig = panel[y][x];
      if (dig === 1) {
        if (y < minY) minY = y;
        if (x < minX) minX = x;
        if (y > maxY) maxY = y;
        if (x > maxX) maxX = x;
      }
    }
  }
  let res = [];
  for (let y = minY; y <= maxY; y++) {
    let row = [];
    for (let x = minX; x <= maxX; x++) {
      row.push(panel[y][x]);
    }
    res.push(row);
  }
  return res;
}
