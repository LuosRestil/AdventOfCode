const { getInput, getNextIdx, getPrevIdx, getHashKey } = require('../utils');

console.time('time');

const dirs = ['n', 'e', 's', 'w'];

let instructions = getInput('day01.txt').split(', ');
let currDir = 0;
let pos = [0, 0];
for (let instruction of instructions) {
  if (instruction[0] === 'R') currDir = getNextIdx(dirs, currDir);
  else currDir = getPrevIdx(dirs, currDir);
  const dist = Number(instruction.slice(1));
  switch (dirs[currDir]) {
    case 'n':
      pos[0] -= dist;
      break;
    case 's':
      pos[0] += dist;
      break;
    case 'w':
      pos[1] -= dist;
      break;
    case 'e':
      pos[1] += dist;
      break;
  }
}

console.log(`Part 1: ${Math.abs(pos[0]) + Math.abs(pos[1])}`);


currDir = 0;
pos = [0, 0];
const visited = new Set();
visited.add(getHashKey(pos[0], pos[1]));
let visitedTwice = null;
for (let instruction of instructions) {
  if (instruction[0] === 'R') currDir = getNextIdx(dirs, currDir);
  else currDir = getPrevIdx(dirs, currDir);
  const dist = Number(instruction.slice(1));
  for (let i = 0; i < dist; i++) {
    switch (dirs[currDir]) {
      case 'n':
        pos[0]--;
        break;
      case 's':
        pos[0]++;
        break;
      case 'w':
        pos[1]--;
        break;
      case 'e':
        pos[1]++;
        break;
    }
    const posHash = getHashKey(pos[0], pos[1]);
    if (visited.has(posHash)) {
      console.log(`Part 2: ${Math.abs(pos[0]) + Math.abs(pos[1])}`);
      process.exit();
    }
    visited.add(posHash);
  }
}

console.timeEnd('time');