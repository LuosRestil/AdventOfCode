import fs from "fs";
import path from "node:path";
import IntcodeComputer from "./intcode.js";

console.time();

const filename = "day21.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

let commands = [
  "NOT T T",
  "AND A T",
  "AND B T",
  "AND C T",
  "NOT T T",
  "AND D T",
  "OR T J",
  "WALK",
];
console.log(`Part 1: ${runWithCommands(commands)}`);

commands = [
  "NOT T T",
  "AND A T",
  "AND B T",
  "AND C T",
  "NOT T T",
  "AND D T",
  "OR E J",
  "OR H J",
  "AND T J",
  "RUN",
];
console.log(`Part 2: ${runWithCommands(commands)}`);

console.timeEnd();

function runWithCommands(commands) {
  let computer = new IntcodeComputer(program, commands.map(toAscii).flat());
  while (computer.state !== IntcodeComputer.STATUS_DONE) {
    try {
      computer.run();
      let output = computer.outputs
        .map((output) => String.fromCharCode(output))
        .join("");
      // console.log(output);
      if (output.includes("Didn't make it across")) {
        break;
      }
      if (computer.outputs.some((output) => output > 9999)) {
        return computer.outputs.at(-1);
      }
    } catch (err) {
      break;
    }
  }
}

function toAscii(command) {
  return command
    .split("")
    .map((char) => char.charCodeAt(0))
    .concat([10]);
}
