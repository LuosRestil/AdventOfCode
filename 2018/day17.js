import fs from "fs";
import path from "node:path";

console.time();

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
  tick();
}

console.log(`Part 1: ${countWater()}`);

// TODO part 2 walk from all streams at the bottom back to the top, removing water

console.timeEnd();

function tick() {
  let stream = streams.pop();
  if (grid[stream.top][stream.x] === WATER) return;
  let currY = stream.top;
  // fall to nearest floor or wall (or water)
  while (currY <= maxY && grid[currY][stream.x] === EMPTY) {
    grid[currY][stream.x] = WATER;
    currY++;
  }
  if (currY > maxY) {
    return;
  }

  // if wall, add two new streams and be done with the current stream
  let landedInWater = grid[currY][stream.x] === WATER;
  if (landedInWater) {
    let wall = wallsByX[stream.x]?.find((wall) => wall.top === currY + 1);
    if (wall) {
      // we've already landed on this wall before, no need to repeat
      return;
    }
  } else {
    // solid
    let wall = wallsByX[stream.x]?.find((wall) => wall.top === currY);
    if (wall) {
      grid[currY - 1][stream.x - 1] = WATER;
      grid[currY - 1][stream.x + 1] = WATER;
      streams.push({ x: stream.x - 1, top: currY });
      streams.push({ x: stream.x + 1, top: currY });
      return;
    }
  }
  let iy = currY;
  if (landedInWater) {
    while (iy <= maxY && grid[iy][stream.x] !== SOLID) {
      iy++;
    }
  }
  if (iy > maxY) return;

  let nearestFloor = floorsByY[iy]?.find(
    (floor) => floor.left <= stream.x && floor.right >= stream.x,
  );
  if (!nearestFloor) {
    // we landed in water far above a wall
    return;
  }

  currY--;

  // find left and right walls
  let validWalls = allWalls
    .filter(
      (wall) => wall.x >= nearestFloor.left && wall.x <= nearestFloor.right,
    )
    .toSorted((a, b) => a.x - b.x);
  let boundingWalls = validWalls.filter(
    (wall) => wall.bottom >= currY && wall.top <= currY,
  );
  let leftWall = boundingWalls.find((wall) => wall.x < stream.x);
  let rightWall = boundingWalls.find((wall) => wall.x > stream.x);
  if (landedInWater && !(!!leftWall && !!rightWall)) {
    // landed in already explored runoff
    return;
  }

  let hitWallLeft = true;
  let hitWallRight = true;
  let lastLeftWallX = -Infinity;
  let lastRightWallX = Infinity;
  while (hitWallLeft && hitWallRight) {
    hitWallLeft = false;
    hitWallRight = false;
    // walk left
    let currX = stream.x;
    while (true) {
      if (
        currX ===
          Math.min(lastLeftWallX - 1, (nearestFloor?.left ?? Infinity) - 1) &&
        grid[currY][currX] === WATER
      ) {
        break;
      }
      if (grid[currY][currX] === SOLID) {
        hitWallLeft = true;
        lastLeftWallX = currX;
        break;
      }
      grid[currY][currX] = WATER;
      if (grid[currY + 1][currX] === EMPTY) {
        streams.push({ x: currX, top: currY + 1 });
        break;
      }
      currX--;
    }
    // walk right
    currX = stream.x;
    while (true) {
      if (
        currX ===
          Math.max(
            lastRightWallX + 1,
            (nearestFloor?.right ?? -Infinity) + 1,
          ) &&
        grid[currY][currX] === WATER
      ) {
        break;
      }
      if (grid[currY][currX] === SOLID) {
        hitWallRight = true;
        lastRightWallX = currX;
        break;
      }
      grid[currY][currX] = WATER;
      if (grid[currY + 1][currX] === EMPTY) {
        streams.push({ x: currX, top: currY + 1 });
        break;
      }
      currX++;
    }
    currY--;
  }
}

function countWater() {
  let total = 0;
  for (let row of grid) {
    for (let col of row) {
      if (col === WATER) {
        total++;
      }
    }
  }
  return total;
}
