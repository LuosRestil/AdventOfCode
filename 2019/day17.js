import fs from "fs";
import path from "node:path";
import IntcodeComputer from "./intcode.js";

console.time();

const filename = "day17.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

let ascii = {
  46: '.',
  35: '#',
  94: '^'
}

let computer = new IntcodeComputer(program, []);
computer.run();
let outputs = computer.outputs;
let grid = [];
let botPos = null;
let row = [];
for (let output of outputs) {
  if (output === 10) {
    grid.push(row);
    row = [];
  } else {
    if (output === 46) row.push('.');
    else if (output === 35) row.push('#');
    else {
      row.push('#');
      botPos = {x: grid.length, y: row.length};
    }
  }
}
grid.forEach(row => console.log(row.join('')));