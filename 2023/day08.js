import fs from 'fs';
const input = fs
  .readFileSync("inputs/day08.txt", { encoding: "utf-8" })
  .split("\n");
const instructions = input[0];
const map = {};
for (let line of input.slice(2)) {
  const splitLine = line.split(" = ");
  const key = splitLine[0];
  const vals = splitLine[1].slice(1, splitLine[1].length - 1).split(", ");
  map[key] = { L: vals[0], R: vals[1] };
}

let steps = 0;
let i = 0;
let curr = "AAA";
while (curr !== "ZZZ") {
  curr = map[curr][instructions[i]];
  steps++;
  i = ++i % instructions.length;
}
console.log("Answer 1: " + steps);

let stepsPerNode = [];
const nodes = Object.keys(map).filter((node) => node[node.length - 1] === "A");
for (let node of nodes) {
  let curr = node;
  steps = 0;
  i = 0;
  while (!(curr[curr.length - 1] === "Z")) {
    curr = map[curr][instructions[i]];
    steps++;
    i = ++i % instructions.length;
  }
  stepsPerNode.push(steps);
}
console.log('Answer 2: ' + lowestCommonMultiple(stepsPerNode));

// division method
function lowestCommonMultiple(nums) {
  let product = 1;
  const primes = getPrimes(Math.max(...nums));
  while (!nums.every((num) => num === 1)) {
    for (let prime of primes) {
      let primeFactorFound = false;
      if (nums.some((num) => num % prime === 0)) {
        primeFactorFound = true;
        product *= prime;
        for (let i = 0; i < nums.length; i++) {
          if (nums[i] % prime === 0) nums[i] /= prime;
        }
      }
      if (primeFactorFound) break;
    }
  }
  return product;
}

// sieve of Eratosthenes
function getPrimes(limit) {
  const primes = [];
  const discovered = new Set();
  for (let i = 2; i < limit; i++) {
    if (!discovered.has(i)) {
      primes.push(i);
      for (let j = i; j < limit; j += i) {
        discovered.add(j);
      }
    }
  }
  return primes;
}