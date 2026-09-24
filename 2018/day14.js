import fs from "fs";
import path from "node:path";

console.time();

let inputStr = fs.readFileSync(
  path.join(import.meta.dirname, "inputs", "day14.txt"),
  "utf-8",
);
let input = parseInt(inputStr);
let inputDigits = inputStr.split('').map(digit => parseInt(digit));

let idx1 = 0;
let idx2 = 1;
let recipes = [3, 7];
while (recipes.length < input + 10) {
  createNewRecipes(recipes[idx1], recipes[idx2]);
  moveElves();
}
console.log(`Part 1: ${recipes.slice(input, input + 10).join("")}`);

while (true) {
  let match = createNewRecipes(recipes[idx1], recipes[idx2]);
  if (match) {
    console.log(`Part 2: ${recipes.length - inputDigits.length}`);
    break;
  }
  moveElves();
}

console.timeEnd();

function createNewRecipes(score1, score2) {
  let sum = score1 + score2;
  if (sum < 10) {
    recipes.push(sum);
    if (recipesEndWithInput()) {
      return true;
    }
  } else {
    recipes.push(1);
    if (recipesEndWithInput()) {
      return true;
    }
    recipes.push(sum - 10);
    if (recipesEndWithInput()) {
      return true;
    }
  }
  return false;
}

function moveElves() {
  idx1 = (idx1 + recipes[idx1] + 1) % recipes.length;
  idx2 = (idx2 + recipes[idx2] + 1) % recipes.length;
}

function recipesEndWithInput() {
  for (let i = 0; i < inputDigits.length; i++) {
    if (recipes.at(-inputDigits.length + i) !== inputDigits[i]) {
      return false
    }
  }
  return true;
}