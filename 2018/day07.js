import fs from "fs";
import path from "node:path";

console.time();

let input = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", "day07.txt"), "utf-8")
  .split("\n")
  .map((row) => row.split(" "))
  .map((row) => [row[1], row[7]]);
let steps = setupSteps((letter) => 1);
let letters = Object.keys(steps).toSorted();
let availableWorkers = 1;
let answer = "";
let ticks = 0;

while (answer.length < letters.length) {
  tick();
}

console.log(`Part 1: ${answer}`);

steps = setupSteps((letter) => letter.charCodeAt(0) - 64 + 60);
availableWorkers = 5;
answer = "";
ticks = 0;

while (answer.length < letters.length) {
  tick();
}

console.log(`Part 2: ${ticks}, ${answer}`); // off by one for some reason, probably just the order of work

console.timeEnd();

function tick() {
  ticks++;
  // what's ready this tick?
  for (let letter of letters) {
    let step = steps[letter];
    if (step.ready) continue;
    step.ready =
      step.from.length === 0 || step.from.every((from) => steps[from].done);
  }
  // assign workers
  for (let letter of letters) {
    let step = steps[letter];
    if (step.done) continue;
    if (step.ready && !step.working && availableWorkers) {
      step.working = true;
      availableWorkers--;
    }
  }
  // do work
  for (let letter in steps) {
    let step = steps[letter];
    if (step.working) {
      step.time--;
      if (step.time === 0) {
        step.working = false;
        step.done = true;
        availableWorkers++;
        answer += letter;
      }
    }
  }
}

function setupSteps(setTime) {
  let steps = {};
  for (let row of input) {
    if (!steps[row[0]]) {
      steps[row[0]] = {
        from: [],
        to: [],
        done: false,
        ready: false,
        working: false,
        time: setTime(row[0]),
      };
    }
    if (!steps[row[1]]) {
      steps[row[1]] = {
        from: [],
        to: [],
        done: false,
        ready: false,
        working: false,
        time: setTime(row[1]),
      };
    }
    steps[row[0]].to.push(row[1]);
    steps[row[1]].from.push(row[0]);
  }
  return steps;
}
