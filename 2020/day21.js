import { getInput } from '../utils.js';

let input = getInput('day21.txt').split('\n');

let allergenMap = {};
let ingredientMap = {};

for (let line of input) {
  let ingredients = line
    .slice(0, line.indexOf("(") - 1)
    .trim()
    .split(" ");
  let allergens = line
    .slice(line.indexOf("(") + 9, line.length - 1)
    .trim()
    .split(", ");
  for (let ingredient of ingredients) {
    if (ingredientMap[ingredient]) {
      ingredientMap[ingredient].frequency += 1;
    } else {
      ingredientMap[ingredient] = { frequency: 1, possibleAllergen: [] };
    }
  }
  for (let allergen of allergens) {
    if (allergenMap[allergen]) {
      allergenMap[allergen].push(ingredients);
    } else {
      allergenMap[allergen] = [ingredients];
    }
  }
}

for (let allergen in allergenMap) {
  // console.log(`allergen: ${allergen}`);
  for (let ingredient of allergenMap[allergen][0]) {
    let ingredientPossibleAllergen = allergenMap[allergen].every((list) =>
      list.includes(ingredient)
    );
    if (ingredientPossibleAllergen) {
      // console.log(`${ingredient} is possible allergen`);
      ingredientMap[ingredient].possibleAllergen.push(allergen);
    }
  }
}

// console.log(ingredientMap);

let total = 0;
for (let ingredient in ingredientMap) {
  if (ingredientMap[ingredient].possibleAllergen.length === 0) {
    total += ingredientMap[ingredient].frequency;
  }
}

console.log(`Answer: ${total}`);

// *********************************************************************

let allergenMatches = [];
while (allergenMatches.length < Object.keys(allergenMap).length) {
  for (let ingredient in ingredientMap) {
    if (ingredientMap[ingredient].possibleAllergen.length === 1) {
      let allergen = ingredientMap[ingredient].possibleAllergen[0];
      allergenMatches.push([allergen, ingredient]);
      for (let ingredient in ingredientMap) {
        if (ingredientMap[ingredient].possibleAllergen.includes(allergen)) {
          ingredientMap[ingredient].possibleAllergen = ingredientMap[
            ingredient
          ].possibleAllergen.filter((item) => item !== allergen);
        }
      }
    }
  }
}

allergenMatches = allergenMatches
  .sort((a, b) => {
    if (a < b) {
      return -1;
    } else if (a === b) {
      return 0;
    } else {
      return 1;
    }
  })
  .map((elem) => elem[1])
  .join(",");

console.log(`Answer: ${allergenMatches}`);
