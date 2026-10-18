import fs from "fs";
import path from "node:path";

console.time();

let filename = "day23.txt";

let bots = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row) => {
    let split = row.split("<")[1].split(">, r=");
    let [x, y, z] = split[0].split(",").map((digit) => parseInt(digit));
    let r = parseInt(split[1]);
    return { x, y, z, r };
  })
  .toSorted((a, b) => b.r - a.r);

let strongestBot = bots[0];
let inRange = 0;
let [minX, minY, minZ, maxX, maxY, maxZ] = [
  Infinity,
  Infinity,
  Infinity,
  -Infinity,
  -Infinity,
  -Infinity,
];
for (let bot of bots) {
  if (pointPointDist(bot, strongestBot) <= strongestBot.r) inRange++;
  if (bot.x < minX) minX = bot.x;
  if (bot.y < minY) minY = bot.y;
  if (bot.z < minZ) minZ = bot.z;
  if (bot.x > maxX) maxX = bot.x;
  if (bot.y > maxY) maxY = bot.y;
  if (bot.z > maxZ) maxZ = bot.z;
}
console.log(`Part 1: ${inRange}`);

let bestCubes = [
  {
    left: minX,
    right: maxX,
    top: minY,
    bottom: maxY,
    back: minZ,
    front: maxZ,
  },
];
while (bestCubes.some((cube) => getCubeSize(cube) > 10)) {
  let bestTotal = 0;
  let localBestCubes = [];
  for (let bestCube of bestCubes) {
    let cubes = subdivide(bestCube);
    for (let cube of cubes) {
      let total = 0;
      for (let bot of bots) {
        if (pointCubeDist(bot, cube) <= bot.r) total++;
      }
      if (total > bestTotal) {
        bestTotal = total;
        localBestCubes = [cube];
      } else if (total === bestTotal) {
        localBestCubes.push(cube);
      }
    }
  }
  bestCubes = localBestCubes;
}

let bestTotal = 0;
let bestPoints = [];
for (let bestCube of bestCubes) {
  for (let x = bestCube.left; x <= bestCube.right; x++) {
    for (let y = bestCube.top; y <= bestCube.bottom; y++) {
      for (let z = bestCube.back; z <= bestCube.front; z++) {
        let total = 0;
        let point = { x, y, z };
        for (let bot of bots) {
          if (pointPointDist(point, bot) <= bot.r) total++;
        }
        if (total > bestTotal) {
          bestTotal = total;
          bestPoints = [point];
        } else if (total === bestTotal) {
          bestPoints.push(point);
        }
      }
    }
  }
}

let origin = { x: 0, y: 0, z: 0 };
let shortest = Infinity;
for (let point of bestPoints) {
  let dist = pointPointDist(point, origin);
  if (dist < shortest) {
    shortest = dist;
  }
}

console.log(`Part 2: ${shortest}`);

function pointPointDist(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
}

function pointCubeDist(point, cube) {
  let nearestPoint = getNearestPoint(point, cube);
  return pointPointDist(nearestPoint, point);
}

function getNearestPoint(point, cube) {
  let { x, y, z } = point;
  if (point.x < cube.left) x = cube.left;
  if (point.x > cube.right) x = cube.right;
  if (point.y < cube.top) y = cube.top;
  if (point.y > cube.bottom) y = cube.bottom;
  if (point.z < cube.back) z = cube.back;
  if (point.z > cube.front) z = cube.front;
  return { x, y, z };
}

function getCubeSize(cube) {
  return (
    (cube.right - cube.left) *
    (cube.bottom - cube.top) *
    (cube.front - cube.back)
  );
}

function subdivide(cube) {
  let midX = Math.ceil((cube.right + cube.left) / 2);
  let midY = Math.ceil((cube.bottom + cube.top) / 2);
  let midZ = Math.ceil((cube.front + cube.back) / 2);
  return [
    {
      left: cube.left,
      right: midX,
      top: cube.top,
      bottom: midY,
      back: cube.back,
      front: midZ,
    },
    {
      left: cube.left,
      right: midX,
      top: cube.top,
      bottom: midY,
      back: midZ,
      front: cube.front,
    },
    {
      left: cube.left,
      right: midX,
      top: midY,
      bottom: cube.bottom,
      back: cube.back,
      front: midZ,
    },
    {
      left: cube.left,
      right: midX,
      top: midY,
      bottom: cube.bottom,
      back: midZ,
      front: cube.front,
    },
    {
      left: midX,
      right: cube.right,
      top: cube.top,
      bottom: midY,
      back: cube.back,
      front: midZ,
    },
    {
      left: midX,
      right: cube.right,
      top: cube.top,
      bottom: midY,
      back: midZ,
      front: cube.front,
    },
    {
      left: midX,
      right: cube.right,
      top: midY,
      bottom: cube.bottom,
      back: cube.back,
      front: midZ,
    },
    {
      left: midX,
      right: cube.right,
      top: midY,
      bottom: cube.bottom,
      back: midZ,
      front: cube.front,
    },
  ];
}
