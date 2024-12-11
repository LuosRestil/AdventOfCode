const fs = require("fs");

let input = fs.readFileSync("inputs/day15.txt", "utf8").split("\n");

// let input = `Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
// Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3`.split('\n');

let ingredients = [];
for (let line of input) {
  line = line.split(": ");
  let data = line[1].split(", ").map((item) => item.split(" "));
  let ingredient = [];
  for (let datum of data) {
    ingredient.push(parseInt(datum[1]));
  }
  ingredients.push(ingredient);
}
let quantities = Array(input.length).fill(1);

// pt. 1
let maxScore = 0;
// for each ingredient, get total if added, keeping best addition, until all ingredients are used up
for (let i = 0; i < 100 - ingredients.length; i++) {
  // we start with one of each cookie, so we don't need to iterate all 100 times
  let bestQuantities = quantities.slice();
  let betterFound = false;
  for (let j = 0; j < ingredients.length; j++) {
    const testQuantities = quantities.slice();
    testQuantities[j]++;
    const score = calculateScore(ingredients, testQuantities);
    if (score > maxScore) {
      maxScore = score;
      bestQuantities = testQuantities.slice();
      betterFound = true;
    }
  }
  quantities = bestQuantities;
}
console.log(`Answer: ${maxScore}`);

// pt. 2
// find all the possible ways of getting 500 cals, then find the best score of those combos
maxScore = 0;
const memo = {};
const combos = getCombinations(500, 100, ingredients.map(ingredient => ingredient[ingredient.length - 1]));
for (let combo of combos) {
  const score = calculateScore(ingredients, combo);
  if (score > maxScore) {
    maxScore = score;
  }
}
console.log(`Answer: ${maxScore}`);


function getCombinations(target, remainingIngredients, cals) {
  if (memo[`${target}:${remainingIngredients}:${cals}`]) {
    return memo[`${target}:${remainingIngredients}:${cals}`]
  }
  if (target <= 0) {
    return [];
  }
  if (cals.length === 0) {
    return [];
  }
  if (cals.length === 1) {
    if (remainingIngredients * cals[0] !== target) {
      memo[`${target}:${remainingIngredients}:${cals}`] = [];
      return [];
    } else {
      memo[`${target}:${remainingIngredients}:${cals}`] = [remainingIngredients];
      return [[remainingIngredients]];
    }
  }
  const combos = [];
  for (let i = 1; i < remainingIngredients + 1; i++) {
    const newTarget = target - cals[0] * i;
    if (newTarget < 0) {
      continue;
    }
    const results = getCombinations(
      target - cals[0] * i,
      remainingIngredients - i,
      cals.slice(1),
      memo,
    ).filter((combo) => combo.length > 0);
    for (let result of results) {
      combos.push([i, ...result]);
    }
  }
  memo[`${target}:${remainingIngredients}:${cals}`] = combos;
  return combos;
}

function calculateScore(ingredients, quantities) {
  const totals = [];
  // col dot quantities for each col
  for (let i = 0; i < ingredients[0].length - 1; i++) {
    const col = ingredients.map((ingredient) => ingredient[i]);
    const dotProd = dot(col, quantities);
    totals.push(Math.max(0, dotProd));
  }
  return totals.reduce((acc, curr) => acc * curr, 1);
}

function dot(v1, v2) {
  let total = 0;
  for (let i = 0; i < v1.length; i++) {
    total += v1[i] * v2[i];
  }
  return total;
}
