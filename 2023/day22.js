import fs from "fs";
import path from "node:path";

console.time();

const filename = "day22.txt";

let blocks = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row, idx) => {
    const [l, r] = row
      .split("~")
      .map((side) => side.split(",").map((num) => parseInt(num)));
    let left = l[0];
    let right = r[0] + 1;
    let front = l[1];
    let back = r[1] + 1;
    let bottom = l[2];
    let top = r[2] + 1;
    return { left, right, front, back, bottom, top };
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
  let above = getAbove(block, blocks);
  if (above.every(other => getBelow(other, blocks).length > 1)) {
    total++;
  }
}

console.log(total);
// 554 too high

console.timeEnd();

function canDrop(block, blocks) {
  if (block.bottom === 1) return false;
  return getBelow(block, blocks).length === 0;
}

function getBelow(block, blocks) {
  return blocks.filter(
    (other) => other.top === block.bottom && xyOverlap(block, other),
  );
}

function getAbove(block, blocks) {
  return blocks.filter(
    (other) => other.bottom === block.top && xyOverlap(block, other),
  );
}

function xyOverlap(a, b) {
  return !(
    a.left >= b.right ||
    a.right <= b.left ||
    a.front >= b.back ||
    a.back <= b.front
  );
}

function drop(block) {
  block.bottom--;
  block.top--;
}
