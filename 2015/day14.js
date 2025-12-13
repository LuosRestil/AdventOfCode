import fs from 'fs';

let input = fs.readFileSync('inputs/day14.txt', 'utf8').split('\n');

const RACE_DURATION = 2503;

let reindeer = [];

for (let line of input) {
  line = line.split(' ');
  let info = {};
  info.name = line[0];
  info.speed = parseInt(line[3]);
  info.flyingTime = parseInt(line[6]);
  info.restingTime = parseInt(line[13]);
  info.distances = [];
  info.score = 0;
  reindeer.push(info);
}

for (let racer of reindeer) {
  let seconds = 1;
  let distance = 0;
  for (let i = 0; i < RACE_DURATION; i++) {
    if (seconds > 0) {
      distance += racer.speed;
    }
    seconds++;
    if (seconds > racer.flyingTime) {
      seconds = -racer.restingTime + 1;
    }
    racer.distances.push(distance);
  }
  racer.finalDistance = distance;
}

console.log(`Answer: ${Math.max(...reindeer.map(deer => deer.finalDistance))}`);

// Pt. 2
for (let i = 0; i < RACE_DURATION; i++) {
  let leadingReindeer = reindeer.sort((a, b) => b.distances[i] - a.distances[i])[0];
  leadingReindeer.score = leadingReindeer.score + 1;
}

console.log(`Answer: ${Math.max(...reindeer.map(deer => deer.score))}`);