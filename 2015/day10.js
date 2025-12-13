import fs from 'fs';

let num = fs.readFileSync('inputs/day10.txt', 'utf8');

// pt. 1, i < 40
// pt. 2, i < 50
for (let i = 0; i < 50; i++) {
  let newNum = '';
  let lastChar = num[0];
  let count = 1;
  for (let j = 1; j < num.length; j++) {
    if (num[j] === lastChar) {
      count++;
    } else {
      newNum += count;
      newNum += lastChar;
      lastChar = num[j];
      count = 1;
    }
  }
  newNum += count;
  newNum += lastChar;
  num = newNum;
}

console.log(`Answer: ${num.length}`);