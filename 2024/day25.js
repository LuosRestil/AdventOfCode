import utils from '../utils.js';

const input = utils.getInput('day25.txt').split('\n\n');

const locks = [];
const keys = [];

for (let elem of input) {
  elem = elem.split('\n').map(row => row.split(''));
  if (elem[0].every(char => char === '#')) {
    // lock
    const heights = [0, 0, 0, 0, 0];
    for (let i = 1; i < 6; i++) {
      for (let j = 0; j < 5; j++) {
        if (elem[i][j] === '#') heights[j]++;
      }
    }
    locks.push(heights);
  } else {
    // key
    const heights = [0, 0, 0, 0, 0];
    for (let i = elem.length - 2; i > 0; i--) {
      for (let j = 0; j < 5; j++) {
        if (elem[i][j] === '#') heights[j]++;
      }
    }
    keys.push(heights);
  }
}

let total = 0;
for (let key of keys) {
  for (let lock of locks) {
    if (compatible(key, lock)) total++;
  }
}

console.log(`Part 1: ${total}`);

function compatible(key, lock) {
  for (let i = 0; i < 5; i++) {
    if (key[i] + lock[i] > 5) return false;
  }
  return true;
}