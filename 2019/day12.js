import fs from "fs";
import path from "node:path";
import { arrEq, lcm } from "../utils.js";

console.time();

const filename = "day12.txt";

let input = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n");
let moons = getMoons(input);
  
for (let i = 0; i < 1000; i++) {
  tick();
}
console.log(`Part 1: ${moons.reduce((acc, curr) => acc + getEnergy(curr), 0)}`);

// find loop size for x, y, and z separately and get lcm
moons = getMoons(input);
let startXs = getComponents(moons, 'x');
let xLoopSize = 0;
while (xLoopSize === 0 || !arrEq(startXs, getComponents(moons, 'x'))) {
  tick();
  xLoopSize++;
}
moons = getMoons(input);
let startYs = getComponents(moons, 'y');
let yLoopSize = 0;
while (yLoopSize === 0 || !arrEq(startYs, getComponents(moons, 'y'))) {
  tick();
  yLoopSize++;
}
moons = getMoons(input);
let startZs = getComponents(moons, 'z')
let zLoopSize = 0;
while (zLoopSize === 0 || !arrEq(startZs, getComponents(moons, 'z'))) {
  tick();
  zLoopSize++;
}
let ans = [xLoopSize, yLoopSize, zLoopSize].reduce((acc, curr) => lcm(acc, curr), 1);
console.log(`Part 2: ${ans}`);

function tick() {
  for (let i = 0; i < moons.length - 1; i++) {
    for (let j = i + 1; j < moons.length; j++) {
      let a = moons[i];
      let b = moons[j];
      if (a.pos.x < b.pos.x) {
        a.vel.x += 1;
        b.vel.x -= 1;
      } else if (a.pos.x > b.pos.x) {
        a.vel.x -= 1;
        b.vel.x += 1;
      }
      if (a.pos.y < b.pos.y) {
        a.vel.y += 1;
        b.vel.y -= 1;
      } else if (a.pos.y > b.pos.y) {
        a.vel.y -= 1;
        b.vel.y += 1;
      }
      if (a.pos.z < b.pos.z) {
        a.vel.z += 1;
        b.vel.z -= 1;
      } else if (a.pos.z > b.pos.z) {
        a.vel.z -= 1;
        b.vel.z += 1;
      }
    }
  }
  for (let i = 0; i < moons.length; i++) {
    let moon = moons[i];
    moon.pos.x += moon.vel.x;
    moon.pos.y += moon.vel.y;
    moon.pos.z += moon.vel.z;
  }
}

function getEnergy(moon) {
  return getPotentialEnergy(moon) * getKineticEnergy(moon);
}

function getPotentialEnergy(moon) {
  return Math.abs(moon.pos.x) + Math.abs(moon.pos.y) + Math.abs(moon.pos.z);
}

function getKineticEnergy(moon) {
  return Math.abs(moon.vel.x) + Math.abs(moon.vel.y) + Math.abs(moon.vel.z);
}

function getComponents(moons, component) {
  let components = [];
  for (let moon of moons) {
    components.push(moon.pos[component]);
    components.push(moon.vel[component]);
  }
  return components;
}

function getMoons(input) {
  return input.map((row) => {
    let split = row.split("=");
    let x = parseInt(split[1].split(",")[0]);
    let y = parseInt(split[2].split(",")[0]);
    let z = parseInt(split[3].split(">")[0]);
    return { pos: { x, y, z }, vel: { x: 0, y: 0, z: 0 } };
  });
}