import fs from 'fs';

let inputParts = fs.readFileSync('inputs/day19.txt', 'utf-8').split('\n\n');
let replacementStrings = inputParts[0].split("\n");
let molecule = inputParts[1];

let replacements = {};

// pt 1 example
// replacementStrings = `H => HO
// H => OH
// O => HH`.split("\n");
// molecule = "HOH";

// pt 2 example
// replacementStrings = `e => H
// e => O
// H => HO
// H => OH
// O => HH`.split('\n');
// molecule = 'HOHOHO';
// molecule = 'HOH';

for (let replacementString of replacementStrings) {
  let splitReplacementString = replacementString.split(" => ");
  let origSymbol = splitReplacementString[0];
  let newSymbol = splitReplacementString[1];
  if (replacements[origSymbol]) {
    replacements[origSymbol].push(newSymbol);
  } else {
    replacements[origSymbol] = [newSymbol];
  }
}

// pt. 1
let newMolecules = new Set();
for (let [key, val] of Object.entries(replacements)) {
  for (let i = 0; i <= molecule.length - key.length; i++) {
    if (molecule.slice(i, i + key.length) === key) {
      for (let replacementValue of val) {
        newMolecules.add(molecule.slice(0, i) + replacementValue + molecule.slice(i + key.length, molecule.length));
      }
    }
  }
}
console.log(`Answer: ${newMolecules.size}`);

// pt. 2
let count = 0;
replacements = {};
for (let replacementString of replacementStrings) {
  let splitReplacementString = replacementString.split(' => ');
  let origSymbol = splitReplacementString[1];
  let newSymbol = splitReplacementString[0];
  replacements[origSymbol] = newSymbol;
}
while (molecule !== 'e') {
  for (let [key, val] of Object.entries(replacements)) {
    const replacement = molecule.replace(key, val);
    if (replacement !== molecule) {
      count++;
      molecule = replacement;
    }
  }
}
console.log(`Answer: ${count}`);