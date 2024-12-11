const fs = require('fs');

let input = fs.readFileSync('inputs/day05.txt', 'utf8');

input = input.split("\n");

// Pt. 1

const VOWELS = "aeiou";
const DISALLOWED = ["ab", "cd", "pq", "xy"];

function isNicePt1(str) {
  let vowels = 0;
  let hasDouble = false;
  for (let i = 0; i < str.length; i++) {
    let sub = str.slice(i, i + 2);
    if (DISALLOWED.includes(sub)) {
      return false;
    }
    if (VOWELS.includes(sub[0])) {
      vowels++;
    }
    if (sub[0] === sub[1]) {
      hasDouble = true;
    }
  }
  if (vowels >= 3 && hasDouble) {
    return true;
  }
  return false;
}

let nice = 0;

for (let str of input) {
  if (isNicePt1(str)) {
    nice++;
  }
}

console.log(`Answer: ${nice}`);

// Pt. 2

nice = 0;

function hasSandwich(str) {
  for (let i = 0, j = 3; i < str.length - 1; i++, j++) {
    let sub = str.slice(i, j);
    if (sub[0] === sub?.[2]) {
      return true;
    }
  }
  return false;
}

function hasRepeatPair(str) {
  let pairs = {};
  for (let i = 0; i < str.length - 1; i++) {
    let sub = str.slice(i, i + 2);
    if (pairs[sub]) {
      return sub;
    }
    pairs[sub] = 1;
    // don't count triplets as two pairs
    if (str[i] === str[i + 1] && str[i + 1] === str[i + 2]) {
      i++;
    }
  }
  return false;
}

for (let str of input) {
  if (hasSandwich(str) && hasRepeatPair(str)) {
    nice++;
  }
}

console.log(`Answer: ${nice}`);