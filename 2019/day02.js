import fs from "fs";
import path from "node:path";
import IntcodeComputer from "./intcode.js";

console.time();

const filename = "day02.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

let computer = new IntcodeComputer(program);
computer.state[1] = 12;
computer.state[2] = 2;
computer.runProgram();
console.log(`Part 1: ${computer.state[0]}`);

let { noun, verb } = findNounVerb(computer, 19690720, 0, 99);
console.log(`Part 2: ${100 * noun + verb}`);

console.timeEnd();

function findNounVerb(computer, target, rangeStart, rangeEnd) {
  for (let noun = rangeStart; noun <= rangeEnd; noun++) {
    for (let verb = rangeStart; verb <= rangeEnd; verb++) {
      computer.reset();
      computer.state[1] = noun;
      computer.state[2] = verb;
      computer.runProgram();
      if (computer.state[0] === target) {
        return { noun, verb };
      }
    }
  }
  return null;
}
