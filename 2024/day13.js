const { getInput } = require("../utils");

const A_COST = 3,
  B_COST = 1;

const machines = getInput("day13sample.txt")
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


function solve(machine) {
  const { a, b, prize } = machine;
  const winningCombos = [];
  let maxA = Math.min(prize.x / a.x, prize.y / a.y);
  let maxB = Math.min(prize.x / b.x, prize.y / b.y);
  for (let aPresses = 0; aPresses <= maxA; aPresses++) {
    for (let bPresses = 0; bPresses <= maxB; bPresses++) {
      const clawX = aPresses * a.x + bPresses * b.x;
      const clawY = aPresses * a.y + bPresses * b.y;
      if (clawX === prize.x && clawY === prize.y)
        winningCombos.push({ a: aPresses, b: bPresses });
    }
  }

  if (!winningCombos.length) return 0;

  let cheapest = winningCombos[0];
  for (let combo of winningCombos) if (combo.b < cheapest.b) cheapest = combo;
  return cheapest.a * A_COST + cheapest.b * B_COST;
}
