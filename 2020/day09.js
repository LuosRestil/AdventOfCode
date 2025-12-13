import { getInput } from '../utils.js';

let input = getInput('day09.txt')
  .split('\n')
  .map((num) => parseInt(num));

function isTwoSum(nums, target) {
  let map = {};
  for (let num of nums) {
    let diff = target - num;
    if (map[diff]) {
      return true;
    } else {
      map[num] = true;
    }
  }
}

let firstInvalid;
for (
  let winStart = 0, winEnd = 25;
  winEnd < input.length;
  winStart++, winEnd++
) {
  if (!isTwoSum(input.slice(winStart, winEnd), input[winEnd])) {
    firstInvalid = input[winEnd];
    break;
  }
}
console.log(`First invalid: ${firstInvalid}`);

// *************************************************************************************

let winStart = 0;
let winEnd = 0;
let total = input[winStart];
while (true) {
  if (total === firstInvalid) {
    let contiguousNums = input.slice(winStart, winEnd + 1);
    let min = Math.min(...contiguousNums);
    let max = Math.max(...contiguousNums);
    console.log(`Encryption weakness: ${min + max}`);
    break;
  } else if (total < firstInvalid) {
    winEnd++;
    total += input[winEnd];
  } else {
    winStart++;
    winEnd = winStart;
    total = input[winStart];
  }
}
