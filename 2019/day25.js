import fs from "fs";
import path from "node:path";
import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import IntcodeComputer from "./intcode.js";

console.time();

// const rl = readline.createInterface({ input: stdin, output: stdout });

const filename = "day25.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

/*
north, south, east, west
take <item>
drop <item>
inv
*/
// from manual exploration
let instructions = [
  "east",
  "east",
  "south",
  "take monolith",
  "north",
  "west",
  "north",
  "north",
  "take planetoid",
  "west",
  "south",
  "south",
  "take fuel cell",
  "north",
  "north",
  "east",
  "east",
  "south",
  "west",
  "north",
  "take astrolabe",
  "west",
  "north",
]
  .map((instruction) => toAscii(instruction))
  .flat();
let computer = new IntcodeComputer(program, instructions);
computer.run();

// while (computer.status !== IntcodeComputer.STATUS_DONE) {
//   computer.run();
//   if (computer.status === IntcodeComputer.STATUS_AWAITING_INPUT) {
//     let output = computer.outputs
//       .map((output) => String.fromCharCode(output))
//       .join("");
//     const answer = await rl.question(output);
//     const ascii = toAscii(answer);
//     computer.inputs.push(...ascii);
//     computer.outputs = [];
//   }
// }
// rl.close();
let output = computer.outputs
  .map((output) => String.fromCharCode(output))
  .join("");
console.log(output);

function toAscii(command) {
  return command
    .split("")
    .map((char) => char.charCodeAt(0))
    .concat([10]);
}
