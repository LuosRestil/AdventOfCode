import fs from "fs";
import path from "node:path";
import IntcodeComputer from "./intcode.js";

console.time();

const filename = "day23.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

let computers = [];
for (let i = 0; i < 50; i++) {
  computers.push(new IntcodeComputer(program, [i]));
}

let p1Ans = null;
while (true) {
  for (let computer of computers) {
    computer.tick();
    if (computer.status === IntcodeComputer.STATUS_AWAITING_INPUT) {
      console.log('oopsie, no input, pushing -1, ' + computer.inputs.length);
      computer.inputs.push(-1);
      computer.tick();
      console.log(computer.inputs.length, computer.status);
    }

    if (computer.outputs.length === 3) {
      let idx = computer.outputs.shift();
      let x = computer.outputs.shift();
      let y = computer.outputs.shift();
      if (idx === 255) {
        p1Ans = y;
        break;
      }
      try {

      computers[idx].inputs.push(x);
      computers[idx].inputs.push(y);
      } catch(err) {
        console.log({outputs: computer.outputs, originalInputs: computer.originalInputs, inputs: computer.inputs});
        console.log(idx, x, y);
        console.log({outputs: computers[idx].outputs, originalInputs: computers[idx].originalInputs, inputs: computers[idx].inputs});
        throw err;
      }
    }
  }
  if (p1Ans) break;
}

console.log(`Part 1: ${p1Ans}`);
