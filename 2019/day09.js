import fs from "fs";
import path from "node:path";
import IntcodeComputer from "./intcode.js";

console.time();

const filename = "day09.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

let computer = new IntcodeComputer(program, [1]);
computer.run();
console.log(`Part 1: ${computer.outputs[0]}`);

computer = new IntcodeComputer(program, [2]);
computer.run();
console.log(`Part 2: ${computer.outputs[0]}`);

console.timeEnd();