import { getInput } from "../utils.js";

console.time('time');

const input = getInput('day19.txt').split('\n\n');

const towels = input[0].split(', ');
const designs = input[1].split('\n');

let memo = new Map();

let pt1Total = 0;
let pt2Total = 0;
for (let design of designs) {
  const possibles = countPossibles(design);
  if (possibles) pt1Total++;
  pt2Total += possibles;
}
console.log(`Part 1: ${pt1Total}`);
console.log(`Part 2: ${pt2Total}`);

console.timeEnd('time');

function countPossibles(design) {
  if (!design.length) return 1;
  if (memo.has(design)) return memo.get(design);
  let total = 0;
  for (let towel of towels) {
    if (design.startsWith(towel)) {
      total += countPossibles(design.slice(towel.length));
    }
  }
  memo.set(design, total);
  return total;
}