console.time("time");

import fs from 'fs';

const map = fs
  .readFileSync("inputs/day10.txt", { encoding: "utf-8" })
  .split("\n")
  .map((row) => row.split("").map((col) => Number(col)));

let p1Total = 0;
let p2Total = 0;
for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[0].length; col++) {
    if (map[row][col] === 0) {
      const nines = getNines([row, col]);
      p1Total += (new Set(nines)).size;
      p2Total += nines.length;
    }
  }
}
console.log(`Part 1: ${p1Total}`);
console.log(`Part 2: ${p2Total}`);

function getNines(start) {
  const discovered = [];
  const queue = [start];
  while (queue.length > 0) {
    const pos = queue.pop();
    const [row, col] = pos;
    const val = map[row][col];
    if (val === 9) discovered.push(`${row}:${col}`);
    // up
    if (isOnMap(row - 1, col) && map[row - 1][col] === val + 1)
      queue.push([row - 1, col]);
    // down
    if (isOnMap(row + 1, col) && map[row + 1][col] === val + 1)
      queue.push([row + 1, col]);
    // left
    if (isOnMap(row, col - 1) && map[row][col - 1] === val + 1)
      queue.push([row, col - 1]);
    // right
    if (isOnMap(row, col + 1) && map[row][col + 1] === val + 1)
      queue.push([row, col + 1]);
  }
  return discovered;
}

function isOnMap(row, col) {
  return row >= 0 && row < map.length && col >= 0 && col < map[0].length;
}

console.timeEnd("time");
