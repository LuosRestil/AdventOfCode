import fs from "fs";
import path from "node:path";

console.time();

const filename = "day22.txt";

const instructions = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((line) => {
    let halves = line.split(" ");
    let val = halves[0] === "on" ? 1 : 0;
    let ranges = halves[1].split(",");
    let xRange = ranges[0]
      .slice(2)
      .split("..")
      .map((num) => parseInt(num));
    let yRange = ranges[1]
      .slice(2)
      .split("..")
      .map((num) => parseInt(num));
    let zRange = ranges[2]
      .slice(2)
      .split("..")
      .map((num) => parseInt(num));
    return {
      val,
      xRange,
      yRange,
      zRange,
    };
  });


