import fs from 'fs';
const input = fs.readFileSync("inputs/day12.txt", { encoding: "utf-8" });
const lines = input.split("\n");

let memo = new Map();
let total = 0;
for (let line of lines) {
  const splitLine = line.split(" ");
  const springs = splitLine[0];
  const groupings = splitLine[1].split(",").map((num) => parseInt(num));
  total += check(springs, groupings, memo);
}
console.log('Answer 1: ' + total);

total = 0;
for (let line of lines) {
  const splitLine = line.split(" ");
  const baseSprings = splitLine[0];
  const baseGroupings = splitLine[1].split(",").map((num) => parseInt(num));
  const springsArr = [];
  const groupingsArr = [];
  for (let i = 0; i < 5; i++) {
    springsArr.push(baseSprings);
    groupingsArr.push(baseGroupings);
  }
  const springs = springsArr.join("?");
  const groupings = groupingsArr.flat();
  total += check(springs, groupings, memo);
}
console.log('Answer 2: ' + total);

function check(springs, groupings, memo) {
  if (memo.has(`${springs}:${groupings}`)) return memo.get(`${springs}:${groupings}`);
  if (springs.length === 0) return groupings.length === 0 ? 1 : 0;
  if (groupings.length === 0) return springs.includes("#") ? 0 : 1;

  if (springs.startsWith(".")) {
    const res = check(springs.slice(1), groupings, memo);  // could jump to next non-dot instead
    memo.set(`${springs}:${groupings}`, res);
    return res;
  }

  if (springs.startsWith("?")) {
    const withHash = check("#" + springs.slice(1), groupings, memo);
    const withDot = check(springs.slice(1), groupings, memo);
    memo.set(`${springs}:${groupings}`, withHash + withDot);
    return withHash + withDot;
  }

  if (springs.startsWith("#")) {
    // can we satisfy the next grouping?
    const hashCount = leadingHashes(springs);
    const target = groupings[0];
    if (hashCount > target) {
      memo[`${springs}:${groupings}`] = 0;
      return 0;
    }
    if (hashCount === target) {
      const res = check(springs.slice(target + 1), groupings.slice(1), memo);
      memo.set(`${springs}:${groupings}`, res);
      return res;
    }
    if (hashCount < target) {
      // can we make more hashes?
      const nonDotCount = leadingNonDots(springs);
      let res = 0;
      if (nonDotCount >= target && springs[target] !== "#") {
        res = check(springs.slice(target + 1), groupings.slice(1), memo);
      }
      memo.set(`${springs}:${groupings}`, res);
      return res;
    }
  }
}

function leadingHashes(str) {
  let i = 0;
  while (str[i] === "#" && i < str.length) i++;
  return i;
}

function leadingNonDots(str) {
  let i = 0;
  while (str[i] !== "." && i < str.length) i++;
  return i;
}