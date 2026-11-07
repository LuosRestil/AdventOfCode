import fs from "fs";
import path from "node:path";

console.time();

const filename = "day24.txt";

let grid = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row) => row.split(""));

