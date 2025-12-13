import fs from 'fs';

console.time();

const lines = fs.readFileSync("inputs/day02.txt", "utf-8").split("\n");
let twos = 0;
let threes = 0;
for (let line of lines) {
  let charCounts = getCharCounts(line);
  if (Object.values(charCounts).includes(2)) twos++;
  if (Object.values(charCounts).includes(3)) threes++;
}
console.log(`Part 1: ${twos * threes}`);
console.log(`Part 2: ${p2(lines)}`);

console.timeEnd();

function getCharCounts(str) {
  let counts = {};
  for (let i = 0; i < str.length; i++) {
    if (!counts[str[i]]) counts[str[i]] = 0;
    counts[str[i]]++;
  }
  return counts;
}

function p2(lines) {
  for (let i = 0; i < lines.length - 1; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      let a = lines[i];
      let b = lines[j];
      let diffIdx = getDiffIdx(a, b);
      if (diffIdx != null) {
        return a.slice(0, diffIdx) + a.slice(diffIdx + 1);
      }
    }
  }
}

function getDiffIdx(a, b) {
  let diffIdx = null;
  for (let k = 0; k < a.length; k++) {
    if (a[k] !== b[k]) {
      if (diffIdx === null) diffIdx = k;
      else return null;
    }
  }
  return diffIdx;
}
