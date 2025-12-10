const fs = require("fs");

console.time();

let polymer = fs.readFileSync("inputs/day05.txt", "utf-8").split("");
console.log(`Part 1: ${react(polymer).length}`);

let chars = new Set();
for (let char of polymer) {
  chars.add(char.toUpperCase());
}
let minLen = Infinity;
for (let char of chars) {
  let shortened = remove(char, polymer);
  let reactedLen = react(shortened).length;
  if (reactedLen < minLen) minLen = reactedLen;
}
console.log(`Part 2: ${minLen}`);

console.timeEnd();

function react(polymer) {
  while (true) {
    let newPolymer = [];
    for (let i = 0; i < polymer.length; i++) {
      try {
        if (shouldDestroy(polymer[i], polymer[i + 1])) {
          i++;
        } else {
          newPolymer.push(polymer[i]);
        }
      } catch (err) {
        // reached end of list
        newPolymer.push(polymer[i]);
      }
    }
    if (newPolymer.length === polymer.length) break;
    polymer = newPolymer;
  }
  return polymer;
}

function remove(char, polymer) {
  let newPolymer = [];
  for (let i = 0; i < polymer.length; i++) {
    const diff = Math.abs(char.charCodeAt(0) - polymer[i].charCodeAt(0));
    if (diff !== 32 && diff !== 0)
      newPolymer.push(polymer[i]);
  }
  return newPolymer;
}

function shouldDestroy(a, b) {
  return Math.abs(a.charCodeAt(0) - b.charCodeAt(0)) === 32;
}
