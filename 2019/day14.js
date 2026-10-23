import fs from "fs";
import path from "node:path";

console.time();

const filename = "day14.txt";

let input = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n");

let recipes = {};
for (let row of input) {
  let sides = row.split(" => ");
  let sourcesSide = sides[0];
  let resultSide = sides[1];
  let [quantity, name] = resultSide.split(" ");
  let ingredients = sourcesSide
    .split(", ")
    .map((src) => src.split(" "))
    .map((source) => {
      return { quantity: parseInt(source[0]), name: source[1] };
    });

  recipes[name] = { quantity: parseInt(quantity), ingredients };
}

console.log(`Part 1: ${oreRequiredForFuel(1)}`);
console.log(`Part 2: ${maxFuelForOreAmount(1000000000000)}`)

function oreRequiredForFuel(quantity) {
  let inventory = {"ORE": 0};
  makeRecipe("FUEL", quantity, inventory);
  return inventory["ORE"];
}

function maxFuelForOreAmount(target) {
  let lowerBound = 1;
  let upperBound = target;
  while (lowerBound < upperBound) {
    let middle = Math.ceil((lowerBound + upperBound) / 2);
    let ore = oreRequiredForFuel(middle);
    if (ore === target) {
      return middle;
    } else if (ore > target){
      upperBound = middle - 1;
    } else{
      lowerBound = middle;
    }
  }
  return lowerBound;
}

function makeRecipe(name, quantity, inventory) {
  if (quantity === 0) return;

  let recipe = recipes[name];
  let batches = Math.ceil(quantity / recipe.quantity);
  for (let ingredient of recipe.ingredients) {
    let need = ingredient.quantity * batches;
    if (ingredient.name === "ORE") {
      inventory["ORE"] += need;
      continue;
    }
    if (!inventory[ingredient.name]) inventory[ingredient.name] = 0;
    let toUse = Math.min(need, inventory[ingredient.name]);
    inventory[ingredient.name] -= toUse;
    need -= toUse;
    makeRecipe(ingredient.name, need, inventory);
  }
  if (!inventory[name]) inventory[name] = 0;
  inventory[name] += batches * recipe.quantity;
  inventory[name] -= quantity;
}
