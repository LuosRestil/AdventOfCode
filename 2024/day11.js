console.time('time');

import fs from 'fs';

const stones = fs.readFileSync('inputs/day11.txt', {encoding: 'utf-8'}).split(' ');

let total = 0;
for (let stone of stones) {
  total += iterate(stone, 0, 25, {});
}
console.log(`Part 1: ${total}`);

total = 0;
for (let stone of stones) {
  total += iterate(stone, 0, 75, {});
}
console.log(`Part 2: ${total}`);

console.timeEnd('time');

function iterate(num, iters, targetIters, memo) {
  if (iters === targetIters) return 1;

  const memoKey = `${iters}:${num}`;
  if (memo[memoKey]) {
    return memo[memoKey];
  }

  let val;

  if (num === "0")
    val = iterate("1", iters + 1, targetIters, memo);
  else if (num.length % 2 === 0) {
    const left = num.slice(0, num.length / 2);
    const right = Number(num.slice(num.length / 2)).toString();
    val = iterate(left, iters + 1, targetIters, memo) + iterate(right, iters + 1, targetIters, memo);
  } else {
    const newNum = Number(num) * 2024
    val = iterate(newNum.toString(), iters + 1, targetIters, memo);
  }

  memo[memoKey] = val;
  return val;
}

