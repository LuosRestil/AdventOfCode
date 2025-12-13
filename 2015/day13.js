import fs from 'fs';
import { getAllPermutations } from '../utils.js';

let input = fs.readFileSync('inputs/day13.txt', 'utf8').split('\n');

let happinessInfo = {};
let people = [];

for (let line of input) {
  line = line.split(' ');
  let person1 = line[0];
  let happiness = parseInt(line[3]);
  if (line[2] === 'lose') {
    happiness = -happiness;
  }
  let person2 = line[10].slice(0, line[10].length - 1);

  if (!people.includes(person1)) {
    people.push(person1);
  }
  if (!people.includes(person2)) {
    people.push(person2);
  }
  if (!happinessInfo[person1]) {
    happinessInfo[person1] = {};
  }
  happinessInfo[person1][person2] = happiness;
}

// Pt. 2 only
happinessInfo['me'] = {};
for (let person of people) {
  happinessInfo['me'][person] = 0;
  happinessInfo[person]['me'] = 0;
}
people.push('me');
// end Pt. 2 only

let seatingArrangements = getAllPermutations(people);

let optimumHappiness = 0;

for (let option of seatingArrangements) {
  let totalHappiness = 0;
  for (let i = 0; i < option.length - 1; i++) {
    totalHappiness += happinessInfo[option[i]][option[i + 1]];
    totalHappiness += happinessInfo[option[i + 1]][option[i]];
  }
  totalHappiness += happinessInfo[option[0]][option[option.length -1]];
  totalHappiness += happinessInfo[option[option.length -1]][option[0]];
  
  if (totalHappiness > optimumHappiness) {
    optimumHappiness = totalHappiness;
  }
}

console.log(`Answer: ${optimumHappiness}`);
