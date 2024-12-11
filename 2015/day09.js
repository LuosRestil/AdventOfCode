const fs = require("fs");
const getAllPermutations = require('./getAllPermutations');

let input = fs.readFileSync('inputs/day09.txt', 'utf8');
input = input.split("\n");

let rtInfo = {};
let citiesList = [];

for (let line of input) {
  line = line.split(" ");
  let city1 = line[0];
  let city2 = line[2];
  let distance = line[4];

  if (!rtInfo[city1]) {
    rtInfo[city1] = {};
  }
  rtInfo[city1][city2] = parseInt(distance);

  if (!rtInfo[city2])  {
    rtInfo[city2] = {};
  }
  rtInfo[city2][city1] = parseInt(distance);

  if (!citiesList.includes(city1)) {
    citiesList.push(city1);
  }
  if (!citiesList.includes(city2)) {
    citiesList.push(city2);
  }
}

let citiesListPermutations = getAllPermutations(citiesList);

let minDistance = Infinity;
let maxDistance = -Infinity;

for (let perm of citiesListPermutations) {
  let distance = 0;
  for (let i = 0; i < perm.length - 1; i++) {
    distance += rtInfo[perm[i]][perm[i + 1]];
  }
  if (distance < minDistance) {
    minDistance = distance
  }
  if (distance > maxDistance) {
    maxDistance = distance;
  }
}

// Pt. 1
console.log(`Answer: ${minDistance}`);
// Pt. 2
console.log(`Answer: ${maxDistance}`);
