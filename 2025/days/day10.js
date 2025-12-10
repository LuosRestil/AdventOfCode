const fs = require("fs");
const { cwd } = require("process");

const lightsRe = /\[(.+)\]/;
const buttonsRe = /\(([^\)]+)\)/g;
const joltageRe = /\{(.+)\}/;

let lines = fs.readFileSync("inputs/day10.txt", "utf-8").split("\n");
let machines = lines.map((line) => parseMachine(line));
let total = 0;
for (let machine of machines) {
  total += solve(
    machine,
    Array(machine.lights.length).fill("."),
    {},
    new Set()
  );
}
console.log(`Part 1: ${total}`);

function solve(machine, lights, memo, seen) {
  let lightsStr = lights.join("");
  if (machine.lights === lightsStr) return 0;
  if (memo[lightsStr]) return memo[lightsStr];
  if (seen.has(lightsStr)) return null;
  seen.add(lightsStr);

  let winner = Infinity;
  let buttonsCopy = [...machine.buttons];
  shuffle(buttonsCopy);
  for (let button of buttonsCopy) {
    let newLights = [...lights];
    for (let idx of button) newLights[idx] = newLights[idx] === "#" ? "." : "#";
    let min = solve(machine, newLights, memo, seen);
    if (min === null) continue;
    if (min < winner) winner = min;
  }
  memo[lightsStr] = winner + 1;
  return winner + 1;
}

function parseMachine(line) {
  let lights = line.match(lightsRe)[1];
  let buttons = Array.from(
    line
      .matchAll(buttonsRe)
      .map((res) => res[1].split(",").map((num) => parseInt(num)))
  );
  let joltage = line
    .match(joltageRe)[1]
    .split(",")
    .map((num) => parseInt(num));
  return { lights, buttons, joltage };
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
