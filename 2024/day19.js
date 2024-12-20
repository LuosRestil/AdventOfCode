import utils from "../utils.js";

const input = utils.getInput('day19sample.txt').split('\n\n');

const towels = input[0].split(', ');
const designs = input[1].split('\n');

let memo = new Map();

let total = 0;
for (let design of designs) {
  if (isPossible(design)) total++;
}
console.log(`Part 1: ${total}`);


function isPossible(design) {
  if (!design.length) return true;
  if (memo.has(design)) return memo.get(design);
  for (let towel of towels) {
    if (design.startsWith(towel) && isPossible(design.slice(towel.length))) {
      memo.set(design, true);
      return true;
    }
  }
  memo.set(design, false);
  return false;
}