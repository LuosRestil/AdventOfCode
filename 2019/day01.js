import fs from "fs";
import path from "node:path";

const filename = "day01.txt";

let modules = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .map((row) => parseInt(row));
console.log(`Part 1: ${modules.reduce((acc, curr) => acc + getFuel(curr), 0)}`);

let totalFuel = 0;
for (let mod of modules) {
  let mass = mod;
  while (mass > 0) {
    let fuel = getFuel(mass);
    if (fuel > 0) totalFuel += fuel;
    mass = fuel;
  }
}

console.log(`Part 2: ${totalFuel}`);

function getFuel(mass) {
  return Math.floor(mass / 3) - 2;
}
