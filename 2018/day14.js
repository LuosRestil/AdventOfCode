import fs from "fs";
import path from "node:path";

console.time();

let inputStr = fs.readFileSync(
  path.join(import.meta.dirname, "inputs", "day14.txt"),
  "utf-8",
);
inputStr = '640441'
let input = parseInt(inputStr);

let elf1Idx = 0;
let elf2Idx = 1;
let recipes = [3, 7];
while (recipes.length < input + 10) {
  createNewRecipes(recipes[elf1Idx], recipes[elf2Idx]);
  moveElves();
}

console.log(`Part 1: ${recipes.slice(input, input + 10).join("")}`);

elf1Idx = 0;
elf2Idx = 1;
recipes = [3, 7];
while (true) {
  createNewRecipes(recipes[elf1Idx], recipes[elf2Idx]);
  if (recipes.slice(recipes.length-5).join('') === inputStr) {
    console.log(`Part 2: ${recipes.length - 5}`);
    break;
  }
  moveElves();
}

console.timeEnd();

function createNewRecipes(score1, score2) {
  let sum = score1 + score2;
  if (sum < 10) {
    recipes.push(sum);
  } else {
    recipes.push(1);
    recipes.push(sum - 10);
  }
}

function moveElves() {
  elf1Idx = (elf1Idx + recipes[elf1Idx] + 1) % recipes.length;
  elf2Idx = (elf2Idx + recipes[elf2Idx] + 1) % recipes.length;
}
