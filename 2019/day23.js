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
let natPacket = null;
let ySet = new Set();
while (true) {
  for (let computer of computers) {
    computer.tick();
    if (computer.outputs.length === 3) {
      let idx = computer.outputs.shift();
      let x = computer.outputs.shift();
      let y = computer.outputs.shift();
      if (idx === 255) {
        if (!p1Ans) p1Ans = y;
        natPacket = { x, y };
      } else {
        computers[idx].inputs.push(x);
        computers[idx].inputs.push(y);
        computers[idx].emptyReceives = 0;
      }
    }
  }

  if (
    computers.every(
      (computer) => computer.inputs.length === 0 && computer.emptyReceives > 1,
    )
  ) {
    computers[0].inputs.push(natPacket.x);
    computers[0].inputs.push(natPacket.y);
    computers[0].emptyReceives = 0;
    if (ySet.has(natPacket.y)) {
      break;
    }
    ySet.add(natPacket.y);
  }

  computers.forEach(computer => {
    if (computer.status === IntcodeComputer.STATUS_AWAITING_INPUT) {
      computer.inputs.push(-1);
    }
  })
}

console.log(`Part 1: ${p1Ans}`);
console.log(`Part 2: ${natPacket.y}`);

console.timeEnd();
