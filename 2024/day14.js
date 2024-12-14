const { getInput, getHashKey } = require("../utils");
const { createCanvas } = require("canvas");
const fs = require("fs");

console.time("time");

const FILEPATH = "day14.txt";
const SECONDS = 100;
const BATH_W = 101;
const BATH_H = 103;
const BATH_X_MIDLINE = Math.floor(BATH_W / 2);
const BATH_Y_MIDLINE = Math.floor(BATH_H / 2);

/***** PART 1 *****/
let robots = getRobots();

for (let i = 0; i < SECONDS; i++) {
  for (let robot of robots) {
    move(robot);
  }
}

const safetyFactor = getSafetyFactor(robots);
console.log(`Part 1: ${safetyFactor}`);

/***** PART 2 *****/
try {
  fs.rmSync("imgs", { recursive: true });
} catch (err) {}
fs.mkdirSync("imgs");

robots = getRobots();
for (let i = 0; i < 10000; i++) {
  if (getSafetyFactor(robots) < safetyFactor / 4) printRobots(robots, i);
  for (let robot of robots) {
    move(robot);
  }
}

console.timeEnd('time');

function getRobots() {
  return getInput(FILEPATH)
    .split("\n")
    .map((row) => row.match(/-?\d+/g).map((num) => parseInt(num)))
    .map((nums) => {
      return {
        pos: { x: nums[0], y: nums[1] },
        vel: { x: nums[2], y: nums[3] },
      };
    });
}

function move(robot) {
  robot.pos.x += robot.vel.x;
  robot.pos.y += robot.vel.y;
  if (robot.pos.x < 0) robot.pos.x = BATH_W + robot.pos.x;
  if (robot.pos.y < 0) robot.pos.y = BATH_H + robot.pos.y;
  if (robot.pos.x >= BATH_W) robot.pos.x = robot.pos.x - BATH_W;
  if (robot.pos.y >= BATH_H) robot.pos.y = robot.pos.y - BATH_H;
}

function getSafetyFactor(robots) {
  const quadrantCounts = { "0:0": 0, "0:1": 0, "1:0": 0, "1:1": 0 };
  robots
    .map((robot) => getQuadrant(robot))
    .filter((quadrant) => quadrant)
    .forEach(
      (quadrant) => quadrantCounts[getHashKey(quadrant.x, quadrant.y)]++
    );
  return Object.values(quadrantCounts).reduce((acc, curr) => acc * curr, 1);
}

function getQuadrant(robot) {
  let quadX, quadY;

  if (robot.pos.x < BATH_X_MIDLINE) quadX = 0;
  else if (robot.pos.x > BATH_X_MIDLINE) quadX = 1;

  if (robot.pos.y < BATH_Y_MIDLINE) quadY = 0;
  else if (robot.pos.y > BATH_Y_MIDLINE) quadY = 1;
  if (quadX === undefined || quadY === undefined) return null;

  return { x: quadX, y: quadY };
}

function printRobots(robots, iteration) {
  const canvas = createCanvas(BATH_W, BATH_H);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, BATH_W, BATH_H);
  ctx.fillStyle = "black";
  for (let robot of robots) {
    ctx.fillRect(robot.pos.x, robot.pos.y, 1, 1);
  }
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(`imgs/iter${iteration}.png`, buffer);
}
