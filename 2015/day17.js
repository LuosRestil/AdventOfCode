console.time('exec');
import fs from 'fs';

let input = fs.readFileSync('inputs/day17.txt', 'utf-8').split('\n').map(numString => parseInt(numString)).sort((a, b) => b - a);

const target = 150;

function countTargetCombos(target, nums, steps, stepsMap) {
  if (target <= 0) {
    return [0, stepsMap];
  }
  let total = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      total++;
      stepsMap[steps] = stepsMap[steps] ? stepsMap[steps] + 1 : 1;
      continue;
    }
    total += countTargetCombos(target - nums[i], nums.slice(i + 1, nums.length), steps + 1, stepsMap)[0];
  }
  
  return [total, stepsMap];
}

let ans = countTargetCombos(target, input, 0, {});

console.log(`Answer Pt. 1: ${ans[0]}`);

let stepsMap = ans[1];
let minSteps = Math.min(...Object.keys(stepsMap));

console.log(`Answer Pt. 2: ${stepsMap[minSteps]}`);

console.timeEnd('exec');
