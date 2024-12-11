const fs = require('fs');

let input = fs.readFileSync('inputs/day16.txt', 'utf-8').split('\n');

let packageInfo = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3, 
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
}

let sues = {};

for (let sue of input) {
  let sueObj = {};
  let nameString = "";
  let detailsIndex;
  for (let i = 0; true; i++) {
    if (sue[i] === ":") {
      detailsIndex = i + 2;
      break;
    }
    nameString += sue[i];
  }
  let details = sue.slice(detailsIndex, sue.length).split(', ').map(info => info.split(": "));
  for (let detail of details) {
    sueObj[detail[0]] = parseInt(detail[1]);
  }
  sues[nameString] = sueObj;
}

let sender;

for (let [key, val] of Object.entries(sues)) {
  if (Object.keys(val).every(sueKey => packageInfo[sueKey] === val[sueKey])) {
    sender = key;
    break;
  }
}

console.log(`Answer: ${sender}`);

// Pt. 2

let sender2 = [];

for (let [key, val] of Object.entries(sues)) {
  if (Object.keys(val).every(sueKey => {
    if (sueKey === 'cats' || sueKey === 'trees') {
      return packageInfo[sueKey] < val[sueKey];
    } else if (sueKey === 'pomeranians' || sueKey === 'goldfish') {
      return packageInfo[sueKey] > val[sueKey];
    } else {
      return packageInfo[sueKey] === val[sueKey];
    }
  })) {
    sender2 = key;
    break;
  }
}

console.log(`Answer: ${sender2}`);