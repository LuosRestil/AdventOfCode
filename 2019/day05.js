import fs from "fs";
import path from "node:path";
import IntcodeComputer from "./intcode.js";

console.time();

const filename = "day05.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

let computer = new IntcodeComputer(program, [1]);
computer.runProgram();
console.log(`Part 1: ${computer.outputs.at(-1)}`);

computer = new IntcodeComputer(program, [5]);
computer.runProgram();
console.log(`Part 2: ${computer.outputs.at(-1)}`);
