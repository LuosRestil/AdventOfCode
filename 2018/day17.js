import fs from "fs";
import path from "node:path";

let wallsByX = {};
let floorsByY = {};
let allWalls = [];
let allFloors = [];
let minY = Infinity;
let maxY = -Infinity;
fs.readFileSync(path.join(import.meta.dirname, "inputs", "day17.txt"), "utf-8")
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
      let wall = { x, top: yRange[0], bottom: yRange[1] };
      if (!wallsByX[x]) {
        wallsByX[x] = [];
      }
      wallsByX[x].push(wall);
      allWalls.push(wall);
      if (yRange[0] < minY) minY = yRange[0];
      if (yRange[1] > maxY) maxY = yRange[1];
    } else {
      // floor
      let y = parseInt(halves[0].slice(2));
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      let xRange = halves[1]
        .slice(2)
        .split("..")
        .map((num) => parseInt(num));
      let floor = { y, left: xRange[0], right: xRange[1] };
      if (!floorsByY[y]) {
        floorsByY[y] = [];
      }
      floorsByY[y].push(floor);
      allFloors.push(floor);
    }
  });

const EMPTY = 0;
const SOLID = 1;
const WATER = 2;
let WIDTH = 1000;
let HEIGHT = maxY + 1;

let grid = [];
for (let y = 0; y < HEIGHT; y++) {
  let row = [];
  for (let x = 0; x < WIDTH; x++) {
    row.push(EMPTY);
  }
  grid.push(row);
}
for (let wall of allWalls) {
  for (let y = wall.top; y <= wall.bottom; y++) {
    grid[y][wall.x] = SOLID;
  }
}
for (let floor of allFloors) {
  for (let x = floor.left; x <= floor.right; x++) {
    grid[floor.y][x] = SOLID;
  }
}

let streams = [{ x: 500, top: minY }];
while (streams.length) {
  let stream = streams.pop();
  console.log(`processing stream at ${stream.x}:${stream.top}`);
  let currY = stream.top;
  while (grid[currY] && grid[currY][stream.x] === EMPTY && currY <= maxY) {
    grid[currY][stream.x] = WATER;
    currY++;
  }
  if (currY > maxY) {
    // we reached the bottom
    console.log('reached the bottom');
    continue;
  }
  currY--;
  // seek left and right for walls or drops
  while (true) {
    let hasLeftWall = false;
    let hasRightWall = false;
    // find left wall
    let currX = stream.x;
    while (true) {
      currX--;
      let left = grid[currY][currX];
      let downLeft = grid[currY + 1][currX];
      if (left === SOLID) {
        hasLeftWall = true;
        break;
      } else {
        grid[currY][currX] = WATER;
      }
      if (!hasLeftWall && downLeft === EMPTY) {
        streams.push({ x: currX, top: currY + 1 });
        break;
      }
    }
    // find right wall
    currX = stream.x;
    while (true) {
      currX++;
      let right = grid[currY][currX];
      let downRight = grid[currY + 1][currX];
      if (right === SOLID) {
        hasRightWall = true;
        break;
      } else {
        console.log(`setting grid[${currY}][${currX}] to water`);
        grid[currY][currX] = WATER;
      }
      if (!hasRightWall && downRight === EMPTY) {
        streams.push({ x: currX, top: currY + 1 });
        break;
      }
    }
    // if both, currY-- and do it again until at least one wall is missing
    if (hasLeftWall && hasRightWall) {
      currY--;
    } else {
      break;
    }
  }
}
