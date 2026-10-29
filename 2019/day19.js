import fs from "fs";
import path from "node:path";
import IntcodeComputer from "./intcode.js";

console.time();

const filename = "day19.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

let inputs = [];
for (let y = 0; y < 50; y++) {
  for (let x = 0; x < 50; x++) {
    inputs.push({ x, y });
  }
}
let ones = 0;
for (let input of inputs) {
  let computer = new IntcodeComputer(program, [input.x, input.y]);
  computer.run();
  if (computer.outputs[0]) ones++;
}
console.log(`Part 1: ${ones}`);

// follow the bottom of the beam
let bottom = { x: 0, y: 0 };
while (true) {
  // check for 100x100 box
  if (bottom.x > 500 && bottom.y > 500) {
    let outputs = [];
    let computer = new IntcodeComputer(program, [bottom.x, bottom.y - 99]);
    computer.run();
    outputs.push(computer.outputs[0]);
    computer = new IntcodeComputer(program, [bottom.x + 99, bottom.y - 99]);
    computer.run();
    outputs.push(computer.outputs[0]);
    computer = new IntcodeComputer(program, [bottom.x + 99, bottom.y]);
    computer.run();
    outputs.push(computer.outputs[0]);
    if (outputs.every((output) => output)) {
      break;
    }
  }
  bottom.x++;
  bottom.y++;
  let computer = new IntcodeComputer(program, [bottom.x, bottom.y]);
  computer.run();
  if (!computer.outputs[0]) {
    bottom.y--;
  }
}

let corner = { x: bottom.x, y: bottom.y - 99 };
console.log(`Part 2: ${corner.x * 10000 + corner.y}`);

console.timeEnd();