import fs from "fs";
import path from "node:path";

console.time();

const filename = "day06.txt";

let input = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row) => row.split(")"));

let map = {};
for (let row of input) {
  if (!map[row[1]]) map[row[1]] = { anchor: null, satellites: [] };
  if (!map[row[0]]) map[row[0]] = { anchor: null, satellites: [] };
  map[row[1]].anchor = row[0];
  map[row[0]].satellites.push(row[1]);
}

let total = 0;
for (let key of Object.keys(map)) {
  let curr = key;
  while (curr !== "COM") {
    total++;
    curr = map[curr].anchor;
  }
}
console.log(`Part 1: ${total}`);

let queue = [[map["YOU"].anchor, 0]];
let target = map["SAN"].anchor;
let seen = new Set(["YOU"]);
let shortest = Infinity;
while (queue.length) {
  let curr = queue.shift();
  let name = curr[0];
  let dist = curr[1];
  if (name === target) {
    shortest = dist;
    break;
  }
  let entry = map[name];
  let neighbors = [entry.anchor, ...entry.satellites];
  for (let neighbor of neighbors) {
    if (!seen.has(neighbor)) {
      seen.add(neighbor);
      queue.push([neighbor, dist + 1]);
    }
  }
}
console.log(`Part 2: ${shortest}`);

console.timeEnd();
