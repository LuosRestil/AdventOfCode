import fs from "fs";
import path from "node:path";
import IntcodeComputer from "./intcode.js";
import { getAllPermutations } from "../utils.js";

console.time();

const filename = "day07.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

console.log(`Part 1: ${getMaxThrusterSignal([0, 1, 2, 3, 4])}`);
console.log(`Part 2: ${getMaxThrusterSignal([5, 6, 7, 8, 9])}`);

console.timeEnd();

function getMaxThrusterSignal(phaseSettings) {
  let permutations = getAllPermutations(phaseSettings);
  let maxThrusterSignal = 0;
  for (let permutation of permutations) {
    let thrusterSignal = getThrusterSignal(permutation);
    if (thrusterSignal > maxThrusterSignal) {
      maxThrusterSignal = thrusterSignal;
    }
  }
  return maxThrusterSignal;
}

function getThrusterSignal(phaseSettings) {
  let lastOutput = 0;
  let computers = phaseSettings.map(
    (phaseSetting) => new IntcodeComputer(program, [phaseSetting]),
  );
  while (computers[0].status !== IntcodeComputer.STATUS_DONE) {
    for (let computer of computers) {
      computer.inputs.push(lastOutput);
      computer.run();
      lastOutput = computer.outputs.at(-1);
    }
  }
  return lastOutput;
}
