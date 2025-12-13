import fs from 'fs';

let lines = fs.readFileSync('problems/day01.txt', {encoding: 'utf-8'}).split('\n');

let total = 0;
for (let line of lines) {
  const first = line.split('').find(char => char >= '0' && char <= '9');
  const last = line.split('').reverse().find(char => char >= '0' && char <= '9');
  total += parseInt(first) * 10 + parseInt(last);
}
console.log('Answer: ' + total);

const writtenDigits = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
total = 0;
for (let line of lines) {
  let digits = [];
  for (let i = 0; i < 10; i++) {
    const indices = getAllIndices(line, i.toString());
    for (let index of indices) {
      digits[index] = i;
    }
  }
  for (let digit of Object.keys(writtenDigits)) {
    const indices = getAllIndices(line, digit);
    for (let index of indices) {
      digits[index] = writtenDigits[digit];
    }
  }
  digits = digits.filter(digit => digit);
  total += digits[0] * 10 + digits[digits.length - 1];
}
console.log('Answer 2: ' + total);

function getAllIndices(str, substr) {
  const indices = [];
  let startIndex = 0, index;
  while ((index = str.indexOf(substr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + substr.length;
  }
  return indices;
}