const { getInput } = require('../utils');

let input = getInput('day03.txt').split('\n');

for (let i = 0; i < input.length; i++) {
  let line = input[i];
  while (input[i].length <= input.length * 7) {
    input[i] += line;
  }
}

function countTrees(right, down) {
  let startRight = right;
  let startDown = down;
  let trees = 0;
  while (startDown < input.length) {
    if (input[startDown][startRight] === "#") {
      trees++;
    }
    startDown += down;
    startRight += right;
  }
  return trees;
}

console.log(`Answer: ${countTrees(3, 1)}`);

// ****************************************************

let total = 1;
let slopes = [
  { right: 1, down: 1 },
  { right: 3, down: 1 },
  { right: 5, down: 1 },
  { right: 7, down: 1 },
  { right: 1, down: 2 },
];
for (let slope of slopes) {
  total *= countTrees(slope.right, slope.down);
}
console.log(`Answer: ${total}`);
