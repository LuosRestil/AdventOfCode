import fs from "fs";
import path from "node:path";

console.time();

const filename = "day03.txt";

let wires = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row) => row.split(","))
  .map((wireDesc) => {
    let curr = [0, 0, 0];
    let nodes = [curr];
    for (let desc of wireDesc) {
      let dir = desc[0];
      let dist = parseInt(desc.slice(1));
      let dest = Array.from(curr);
      if (dir === "R") {
        dest[0] += dist;
      } else if (dir === "L") {
        dest[0] -= dist;
      } else if (dir === "U") {
        dest[1] -= dist;
      } else if (dir === "D") {
        dest[1] += dist;
      }
      dest[2] += dist;
      nodes.push(dest);
      curr = dest;
    }
    let lines = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      lines.push([nodes[i], nodes[i + 1]]);
    }
    return lines;
  });

let intersections = [];
for (let i = 0; i < wires.length - 1; i++) {
  for (let j = i + 1; j < wires.length; j++) {
    let a = wires[i];
    let b = wires[j];
    intersections = intersections.concat(getIntersections(a, b));
  }
}
let minDist = Infinity;
let minSteps = Infinity;
for (let intersection of intersections) {
  let dist = Math.abs(intersection[0]) + Math.abs(intersection[1]);
  if (dist < minDist) minDist = dist;
  if (intersection[2] < minSteps) {
    minSteps = intersection[2];
  }
}
console.log(`Part 1: ${minDist}`);
console.log(`Part 2: ${minSteps}`);

console.timeEnd();

function getIntersections(lines1, lines2) {
  let intersections = [];
  for (let a of lines1) {
    for (let b of lines2) {
      let aVert = a[0][0] === a[1][0];
      let bVert = b[0][0] === b[1][0];
      if ((aVert && bVert) || (!aVert && !bVert)) {
        // parallel
        continue;
      }
      let [vert, horiz] = [a, b];
      if (!aVert) {
        vert = b;
        horiz = a;
      }
      let horizLeft = horiz[0][0] < horiz[1][0] ? horiz[0] : horiz[1];
      let horizRight = horizLeft === horiz[0] ? horiz[1] : horiz[0];
      let vertTop = vert[0][1] < vert[1][1] ? vert[0] : vert[1];
      let vertBottom = vertTop === vert[0] ? vert[1] : vert[0];
      let horizStart = horizLeft[2] < horizRight[2] ? horizLeft : horizRight;
      let vertStart = vertTop[2] < vertBottom[2] ? vertTop : vertBottom;

      if (
        horizLeft[0] <= vert[0][0] &&
        horizRight[0] >= vert[0][0] &&
        vertTop[1] <= horiz[0][1] &&
        vertBottom[1] >= horiz[0][1]
      ) {
        let intersectionX = vert[0][0];
        let intersectionY = horiz[0][1];
        let xSteps = Math.abs(horizStart[0] - intersectionX) + horizStart[2];
        let ySteps = Math.abs(vertStart[1] - intersectionY) + vertStart[2];
        let intersection = [vert[0][0], horiz[0][1], xSteps + ySteps];
        if (intersection[0] === 0 && intersection[1] === 0) continue;
        intersections.push(intersection);
      }
    }
  }
  return intersections;
}
