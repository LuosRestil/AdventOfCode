console.time("time");

const { getInput } = require("../utils");

const packages = getInput("day24.txt")
  .split("\n")
  .map((num) => Number(num))
  .toReversed();

let minLength;

doTheThing(3);
doTheThing(4);

function doTheThing(numGroups) {
  const targetWeight = packages.reduce((acc, curr) => acc + curr, 0) / numGroups;

  minLength = Infinity;
  const combos = getTargetCombos(targetWeight, packages, 1);
  const ofMinLen = combos.filter((combo) => combo.length === minLength);
  let minQuantumEntanglement = Infinity;
  for (let combo of ofMinLen) {
    const quantumEntanglement = combo.reduce((acc, curr) => acc * curr, 1);
    if (quantumEntanglement < minQuantumEntanglement)
      minQuantumEntanglement = quantumEntanglement;
  }
  console.log(`Part ${numGroups === 3 ? 1 : 2}: ${minQuantumEntanglement}`);
}

function getTargetCombos(target, packages, depth) {
  if (depth > minLength) return [];
  if (target < 0 || depth > minLength) return [];
  if (target === 0) return [[]];

  const results = [];
  for (let i = 0; i < packages.length; i++) {
    const toCompleteTarget = getTargetCombos(
      target - packages[i],
      packages.slice(i + 1),
      depth + 1
    );
    for (let arr of toCompleteTarget) {
      const res = [packages[i], ...arr];
      if (depth === 1 && res.length < minLength) {
        minLength = res.length;
      };
      results.push(res);
    }
  }
  return results;
}

console.timeEnd("time");
