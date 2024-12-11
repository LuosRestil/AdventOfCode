const { getInput } = require('../utils');

let input = getInput('day10.txt')
  .split('\n')
  .map(num => parseInt(num))
  .toSorted((a, b) => a - b);

input.unshift(0);
input.push(input[input.length - 1] + 3);

let ones = 0;
let threes = 0;
for (let i = 1; i < input.length; i++) {
  let diff = input[i] - input[i - 1];
  if (diff === 1) {
    ones++;
  } else if (diff === 3) {
    threes++;
  }
}

console.log(`Answer: ${ones * threes}`);

// *****************************************************************

let connectionMap = {};
let memo = {};
for (let i = 0; i < input.length; i++) {
  connectionMap[input[i]] = [];
  if (i === input.length - 1) {
    break;
  }
  for (let j = i + 1; input[j] <= input[i] + 3; j++) {
    connectionMap[input[i]].push(input[j]);
  }
}

const countPaths = (adapter) => {
  if (memo[adapter]) return memo[adapter];
  if (connectionMap[adapter].length === 0) {
    memo[adapter] = 1;
    return memo[adapter];
  } else {
    let total = 0;
    for (let num of connectionMap[adapter]) {
      total += countPaths(num);
    }
    memo[adapter] = total;
    return memo[adapter];
  }
};

console.log(`Answer: ${countPaths(0)}`);
