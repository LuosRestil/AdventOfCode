const { getInput } = require('../utils');

const input = getInput('day06.txt').split('\n');
const times = input[0].split(/\s+/g).slice(1);
const distances = input[1].split(/\s+/g).slice(1);

const raceRecords = [];
for (let i = 0; i < times.length; i++) {
  raceRecords.push({time: parseInt(times[i]), distance: parseInt(distances[i])});
}

let total = 1;
for (let raceRecord of raceRecords) {
  let waysToWin = 0;
  for (let i = 1; i < raceRecord.time; i++) {
    const dist = i * (raceRecord.time - i);
    if (dist > raceRecord.distance) {
      waysToWin++;
    }
  }
  total *= waysToWin;
}
console.log('Answer 1: ' + total);


const time = parseInt(times.join(''));
const distanceRecord = parseInt(distances.join(''));

let waysToWin = 0;
for (let i = 1; i < time; i++) {
  const dist = i * (time - i);
  if (dist > distanceRecord) {
    waysToWin++;
  }
}
console.log('Answer 2: ' + waysToWin);