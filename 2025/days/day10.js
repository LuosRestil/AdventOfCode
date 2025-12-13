import fs from 'fs';

console.time();

const lightsRe = /\[(.+)\]/;
const buttonsRe = /\(([^\)]+)\)/g;
const joltageRe = /\{(.+)\}/;

let machines = fs
  .readFileSync("inputs/day10.txt", "utf-8")
  .split("\n")
  .map((line) => parseMachine(line));

console.log(
  `Part 1: ${machines.reduce((acc, curr) => (acc += bfsLights(curr)), 0)}`
);

let joltageTotal = 0;
for (let [idx, machine] of machines.entries()) {
  console.log('processing ' + idx);
  joltageTotal += bfsJoltage(machine);
}
console.log(`Part 2: ${joltageTotal}`);

console.timeEnd();

function bfsLights(machine) {
  let startingLights = Array(machine.lights.length).fill(".");
  let seen = {};
  let queue = [startingLights.join("") + ":" + 0];

  while (queue.length) {
    let state = queue.shift();
    let sp = state.split(":");
    let steps = parseInt(sp[1]);
    if (sp[0] === machine.lights) {
      return steps;
    }

    for (let button of machine.buttons) {
      let newLights = sp[0].split("");
      for (let idx of button) {
        newLights[idx] = newLights[idx] === "#" ? "." : "#";
      }
      let newLightsStr = newLights.join("");
      if ((seen[newLightsStr] ?? Infinity) > steps) {
        queue.push(newLightsStr + ":" + (steps + 1));
        seen[newLightsStr] = steps;
      }
    }
  }
}

function bfsJoltage(machine) {
  let startingJoltage = Array(machine.joltage.length).fill(0);
  let seen = {};
  let queue = [startingJoltage.join(",") + ":" + 0];

  while (queue.length) {
    let state = queue.shift();
    let sp = state.split(":");
    let joltage = sp[0].split(",").map((num) => parseInt(num));
    let steps = parseInt(sp[1]);
    if (arraysEqual(joltage, machine.joltage)) {
      return steps;
    }

    for (let button of machine.buttons) {
      let newJoltage = [...joltage];
      for (let idx of button) {
        newJoltage[idx]++;
      }
      let newJoltageStr = newJoltage.join(",");
      if (
        isValid(newJoltage, machine.joltage) &&
        (seen[newJoltageStr] ?? Infinity) > steps
      ) {
        queue.push(newJoltageStr + ":" + (steps + 1));
        seen[newJoltageStr] = steps;
      }
    }
  }
  return null;
}

function isValid(joltage, machineJoltage) {
  for (let i = 0; i < joltage.length; i++)
    if (joltage[i] > machineJoltage[i]) return false;
  return true;
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (b[i] !== a[i]) return false;
  }
  return true;
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

function greedyClick(machine) {
  let total = machine.joltage.reduce((acc, curr) => acc + curr);
  let weights = [...machine.joltage];
  let maxWeight = 0;
  for (let i = 0; i < machine.joltage.length; i++) {
    weights[i] = Math.round((weights[i] / total) * 100);
    if (weights[i] > maxWeight) maxWeight = weights[i];
  }

  weights = weights.map((weight) => {
    let normalized = weight - Math.floor(maxWeight / 2);
    let squared = normalized ** 2;
    if (normalized < 0) squared *= -1;
    return squared;
  });

  let scores = [];
  let winner = -Infinity;
  let winnerWeight = -Infinity;
  for (let i = 0; i < machine.buttons.length; i++) {
    let weight = 0;
    for (let num of machine.buttons[i]) {
      weight += weights[num];
    }
    if (weight > winnerWeight) {
      winnerWeight = weight;
      winner = i;
    }
    scores[i] = weight;
  }

  
  for (let idx of machine.buttons[winner]) {
    machine.joltage[idx]--;
  }
}
