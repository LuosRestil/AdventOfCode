const { getInput } = require('../utils');

let input = getInput('day15.txt').split(',').map(num => parseInt(num));

let target = 30_000_000;

let record = new Map();

for (let i = 0; i < input.length; i++) {
  record.set(input[i], [i + 1]);
}

let turn = input.length + 1;
let consider = input[input.length - 1];
while (turn <= target) {
  if (turn % 1_000_000 === 0) {
    console.log(turn);
  }
  let uses = record.get(consider);
  let speak;
  if (uses.length === 1) {
    speak = 0;
  } else {
    speak = uses[1] - uses[0];
  }
  if (record.has(speak)) {
    if (record.get(speak).length > 1) {
      record.set(speak, [record.get(speak)[1], turn]);
    } else {
      record.set(speak, [record.get(speak)[0], turn]);
    }
  } else {
    record.set(speak, [turn]);
  }
  consider = speak;
  turn++;
}
console.log(consider);
