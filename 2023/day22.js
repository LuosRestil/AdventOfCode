import fs from "fs";
import path from "node:path";

console.time();

const filename = "day22sample.txt";

let idx = 0;
let blocks = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row) => {
    const [l, r] = row
      .split("~")
      .map((side) => side.split(",").map((num) => parseInt(num)));
    let left = l[0];
    let right = r[0] + 1;
    let front = l[1];
    let back = r[1] + 1;
    let bottom = l[2];
    let top = r[2] + 1;
    return { left, right, front, back, bottom, top, name: idx++ };
  })
  .toSorted((a, b) => a.bottom - b.bottom);

// drop all blocks
for (let block of blocks) {
  while (canDrop(block, blocks)) {
    drop(block);
  }
}
// find non-supporting blocks
let total = 0;
for (let block of blocks) {
  if (!isSupport(block, blocks)) {
    total++;
  }
}
console.log(blocks);
console.log(total);

console.timeEnd();

function canDrop(block, blocks) {
  if (block.bottom === 1) return false;
  let below = blocks.filter((other) => other.top === block.bottom);
  for (let other of below) {
    if (xyOverlap(block, other)) {
      return false;
    }
  }
  return true;
}

function isSupport(block, blocks) {
  let above = blocks.filter(other => other.bottom === block.top);
  for (let other of above) {
    if (xyOverlap(block, other)) {
      return true;
    }
  }
  return false;
}

function xyOverlap(a, b) {
  return !(
    a.left > b.right ||
    a.right < b.left ||
    a.front > b.back ||
    a.back < b.front
  );
}

function drop(block) {
  block.bottom--;
  block.top--;
}
