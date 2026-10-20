import fs from "fs";
import path from "node:path";

console.time();

const filename = "day08.txt";

let input = fs.readFileSync(
  path.join(import.meta.dirname, "inputs", filename),
  "utf-8",
);
let [width, height] = [25, 6];
let area = width * height;
console.log(input.length / area);
let layers = [];
let layer = [];
for (let i = 0; i < input.length; i++) {
  if (i > 0 && i % area === 0) {
    layers.push(layer);
    layer = [];
  }
  layer.push(input[i]);
}
layers.push(layer);

let totals = [];
for (let layer of layers) {
  let [zeros, ones, twos] = [0, 0, 0];
  for (let char of layer) {
    if (char === '0') zeros++;
    if (char === '1') ones++;
    if (char === '2') twos++;
  }
  totals.push({zeros, ones, twos});
}
totals.sort((a, b) => a.zeros - b.zeros);
console.log(`Part 1: ${totals[0].ones * totals[0].twos}`);

console.timeEnd();
