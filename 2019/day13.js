import fs from "fs";
import path from "node:path";
import IntcodeComputer from "./intcode.js";

console.time();

const filename = "day13.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

let computer = new IntcodeComputer(program, []);
computer.run();
let blockTiles = 0;
let ballPos = null;
let [maxX, maxY] = [0, 0];
for (let i = 0; i < computer.outputs.length; i += 3) {
  let x = computer.outputs[i];
  let y = computer.outputs[i + 1];
  let tile = computer.outputs[i + 2];
  if (tile === 2) blockTiles++;
  if (tile === 4) ballPos = [x, y];
  if (x > maxX) maxX = x;
  if (y > maxY) maxY = y;
}
console.log(`Part 1: ${blockTiles}`);
console.log(maxX, maxY);
console.log(ballPos);

