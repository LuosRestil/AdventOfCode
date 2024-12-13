const { getInput } = require("../utils");

console.time('time');

const A_COST = 3, B_COST = 1;

const machines = getInput("day13.txt")
  .split("\n\n")
  .map((machine) => {
    const lines = machine
      .split("\n")
      .map((line) => line.match(/\d+/g).map((num) => Number(num)));
    return {
      a: { x: lines[0][0], y: lines[0][1] },
      b: { x: lines[1][0], y: lines[1][1] },
      prize: { x: lines[2][0], y: lines[2][1] },
    };
  });

let total = 0;
for (let machine of machines) {
  total += solve(machine);
}
console.log(`Part 1: ${total}`);

total = 0;
for (let machine of machines) {
  machine.prize.x += 10_000_000_000_000;
  machine.prize.y += 10_000_000_000_000;
  total += solve(machine);
}
console.log(`Part 2: ${total}`);

console.timeEnd('time');

function solve(machine) {
  const { a, b, prize } = machine;

  const bPresses = (a.x * prize.y - a.y * prize.x) / (a.x * b.y - a.y * b.x);
  const aPresses = (prize.x - b.x * bPresses) / a.x;

  if (aPresses % 1 !== 0 || bPresses % 1 !== 0) return 0;

  return aPresses * A_COST + bPresses * B_COST;
}
