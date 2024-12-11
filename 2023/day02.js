const fs = require('fs');

let lines = fs.readFileSync('inputs/day02.txt', {encoding: 'utf-8'}).split('\n');

const maxes = {
  red: 12,
  green: 13,
  blue: 14,
};
let sum = 0;
for (let line of lines) {
  const splitLine = line.split(': ');
  const gameId = parseInt(splitLine[0].split(' ')[1]);
  const rounds = splitLine[1].split('; ');
  const isPossible = rounds.every(round => {
    const cubes = round.split(', ');
    for (let group of cubes) {
      group = group.split(' ');
      const num = parseInt(group[0]);
      const color = group[1];
      if (maxes[color] < num) {
        return false;
      }
    }
    return true;
  });
  if (isPossible) {
    sum += gameId;
  }
}
console.log('Answer 1: ' + sum);

sum = 0;
for (let line of lines) {
  const rounds = line.split(': ')[1].split('; ');
  const mins = {
    red: 0,
    green: 0,
    blue: 0,
  };
  for (let round of rounds) {
    const cubes = round.split(', ');
    for (let group of cubes) {
      group = group.split(' ');
      const num = parseInt(group[0]);
      const color = group[1];
      if (mins[color] < num) {
        mins[color] = num;
      }
    }
  }
  // console.log(mins);
  sum += Object.values(mins).reduce((acc, curr) => acc * curr, 1);
}
console.log('Answer 2: ' + sum);