import fs from "fs";
import path from "node:path";

console.time();

const filename = "day08.txt";

let input = fs.readFileSync(
  path.join(import.meta.dirname, "inputs", filename),
  "utf-8",
);
let [width, height] = [25, 6];
let size = width * height;
let layers = [];
let layer = [];
for (let i = 0; i < input.length; i++) {
  if (i > 0 && i % size === 0) {
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
    if (char === "0") zeros++;
    if (char === "1") ones++;
    if (char === "2") twos++;
  }
  totals.push({ zeros, ones, twos });
}
totals.sort((a, b) => a.zeros - b.zeros);
console.log(`Part 1: ${totals[0].ones * totals[0].twos}`);

let img = Array(size).fill(2);
for (let layerIdx = layers.length - 1; layerIdx >= 0; layerIdx--) {
  let layer = layers[layerIdx];
  for (let imgIdx = 0; imgIdx < size; imgIdx++) {
    if (layer[imgIdx] !== '2') img[imgIdx] = layer[imgIdx];
  }
}

img = img.map(num => num === '1' ? '⬜️' : num === '0' ? '⬛️' : num);
console.log('Part 2:');
while (img.length) {
  console.log(img.slice(0, 25).join(''));
  img = img.slice(25);
}

console.timeEnd();
