import fs from "fs";
import path from "node:path";

let walls = {};
let floors = {};
let minY = Infinity;
let maxY = -Infinity;
fs.readFileSync(
  path.join(import.meta.dirname, "inputs", "day17.txt"),
  "utf-8",
)
  .split("\n")
  .forEach((row) => {
    let halves = row.split(", ");
    if (halves[0].startsWith("x")) {
      // wall
      let x = parseInt(halves[0].slice(2));
      let yRange = halves[1]
        .slice(2)
        .split("..")
        .map((num) => parseInt(num));
      if (!walls[x]) {
        walls[x] = [];
      }
      walls[x].push({ top: yRange[0], bottom: yRange[1] });
      if (yRange[0] < minY) minY = yRange[0];
      if (yRange[1] > maxY) maxY = yRange[1];
    } else {
      // floor
      let y = parseInt(halves[1].slice(2));
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      let xRange = halves[0]
        .slice(2)
        .split("..")
        .map((num) => parseInt(num));
      if (!floors[y]) {
        floors[y] = [];
      }
      floors[y].push({ y, left: xRange[0], right: xRange[1] });
    }
  });

console.log(minY, maxY);

// starting at 