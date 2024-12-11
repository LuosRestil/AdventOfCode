const fs = require("fs");
const input = fs.readFileSync("inputs/day05.txt", { encoding: "utf-8" });
const lines = input.split("\n").filter((line) => line);

const seeds = lines[0]
  .split(": ")[1]
  .split(" ")
  .map((seed) => parseInt(seed));
let maps = [];
let currMap = [];
for (let line of lines.slice(2)) {
  if (line[line.length - 1] === ":") {
    maps.push(currMap);
    currMap = [];
  } else {
    line = line.split(" ").map((num) => parseInt(num));
    currMap.push({ dest: line[0], src: line[1], range: line[2] });
  }
}
maps.push(currMap);

console.time('pt1');
let min = Infinity;
for (let val of seeds) {
  for (let map of maps) {
    val = translateFromMap(val, map);
  }
  if (val < min) min = val;
}
console.log("Answer 1: " + min);
console.timeEnd('pt1');

console.time('pt2');
min = Infinity;
for (let i = 0; i < seeds.length; i += 2) {
  for (let j = seeds[i]; j < seeds[i] + seeds[i + 1]; j++) {
    let val = j;
    for (let map of maps) {
      val = translateFromMap(val, map);
    }
    if (val < min) min = val;
  }
}
console.log("Answer 2: " + min);
console.timeEnd('pt2');

function translateFromMap(val, map) {
  for (let row of map) {
    if (val >= row.src && val < row.src + row.range) {
      return row.dest + (val - row.src);
    }
  }
  return val;
}
