import fs from "fs";
import path from "node:path";

console.time();

let filename = "day25.txt";

let points = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row) => row.split(",").map((num) => parseInt(num)));

let constellations = [[points[0]]];
for (let point of points.slice(1)) {
  let constellationMatchIndices = [];
  for (let i = 0; i < constellations.length; i++) {
    for (let other of constellations[i]) {
      let dist = manhattanDistance(point, other);
      if (dist <= 3) {
        constellationMatchIndices.push(i);
        break;
      }
    }
  }
  if (!constellationMatchIndices.length) {
    constellations.push([point]);
  } else {
    constellations[constellationMatchIndices[0]].push(point);
    for (let idx of constellationMatchIndices.slice(1)) {
      for (let other of constellations[idx]) {
        constellations[constellationMatchIndices[0]].push(other);
      }
    }
    for (let i = constellationMatchIndices.length - 1; i > 0; i--) {
      constellations.splice(constellationMatchIndices[i], 1);
    }
  }
}

// console.log(constellations);

console.log(`Part 1: ${constellations.length}`);

console.timeEnd();

function manhattanDistance(a, b) {
  return (
    Math.abs(a[0] - b[0]) +
    Math.abs(a[1] - b[1]) +
    Math.abs(a[2] - b[2]) +
    Math.abs(a[3] - b[3])
  );
}
