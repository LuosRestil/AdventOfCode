console.time('time');

const fs = require("fs");

const lines = fs
  .readFileSync("inputs/day07.txt", {encoding: 'utf-8'})
  .split("\n")
  .map((line) => line.split(": "))
  .map((line) => {
    return {
      total: Number(line[0]),
      operands: line[1].split(" ").map((num) => Number(num)),
    };
  });

let total = 0;
for (let line of lines) {
  if (isPossible(line.total, line.operands)) total += line.total;
}
console.log(`Part 1: ${total}`);

total = 0;
for (let line of lines) {
  if (isPossible(line.total, line.operands, true)) {
    total += line.total;
  }
}
console.log(`Part 2: ${total}`);

function isPossible(target, operands, allowThirdOperator = false) {
  if (operands.length === 1) return target === operands[0];
  const plus = isPossible(
    target,
    [operands[0] + operands[1]].concat(operands.slice(2)),
    allowThirdOperator
  );
  if (plus) return true;
  const times = isPossible(
    target,
    [operands[0] * operands[1]].concat(operands.slice(2)),
    allowThirdOperator
  );
  if (times) return true;
  if (allowThirdOperator) {
    const conc = isPossible(
      target,
      [Number(operands[0].toString() + operands[1].toString())].concat(
        operands.slice(2)
      ),
      allowThirdOperator
    );
    if (conc) return true;
  }
  return false;
}

console.timeEnd('time')