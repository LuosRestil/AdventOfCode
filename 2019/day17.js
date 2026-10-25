import fs from "fs";
import path from "node:path";
import IntcodeComputer from "./intcode.js";

console.time();

const filename = "day17.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

let dirs = [
  { char: "^", vec: { x: 0, y: -1 } },
  { char: ">", vec: { x: 1, y: 0 } },
  { char: "v", vec: { x: 0, y: 1 } },
  { char: "<", vec: { x: -1, y: 0 } },
];

let computer = new IntcodeComputer(program, []);
computer.run();
let outputs = computer.outputs;
let grid = [];
let botPos = null;
let botDir = null;
let row = [];
console.log(outputs.slice(outputs.length - 10));
for (let output of outputs.slice(0, outputs.length - 1)) {
  if (output === 10) {
    grid.push(row);
    row = [];
  } else {
    if (output === 46) row.push(".");
    else if (output === 35) row.push("#");
    else {
      row.push("#");
      botPos = { y: grid.length, x: row.length };
      if (output === 94) botDir = 0;
      else if (output === 118) botDir = 2;
      else if (output === 62) botDir = 1;
      else if (output === 60) botDir = 3;
      else {
        throw new Error("unknown character");
      }
    }
  }
}

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {

    
  }
}

function printGrid(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      let char = grid[y][x];
      if (y === botPos.y && x === botPos.x)
        process.stdout.write(dirs[botDir].char);
      else process.stdout.write(char);
    }
    process.stdout.write("\n");
  }
}
