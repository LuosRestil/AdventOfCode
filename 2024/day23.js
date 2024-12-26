import utils from "../utils.js";

const lines = utils
  .getInput("day23.txt")
  .split("\n")
  .map((line) => line.split("-"));
let connections = {};
for (let line of lines) {
  let a = line[0];
  let b = line[1];
  if (!connections[a]) connections[a] = [];
  if (!connections[b]) connections[b] = [];
  connections[a].push(b);
  connections[b].push(a);
}

let seen = new Set();
for (let key in connections) {
  if (key.startsWith('t')) {
    for (let i = 0; i < connections[key].length - 1; i++) {
      let a = connections[key][i];
      if (a === key) continue;
      for (let j = i + 1; j < connections[key].length; j++) {
        let b = connections[key][j];
        if (b === key) continue;
        if (connections[a].includes(b)) {
          seen.add(utils.getHashKey(...[key, a, b].toSorted()))
        }
      }
    }
  }
}
console.log(`Part 1: ${seen.size}`);

for (let key in connections) {
  connections[key] = new Set(connections[key]);
  connections[key].add(key);
}

const intersections = new Set();
let keys = Object.keys(connections);
for (let i = 0; i < keys.length; i++) {
  const setA = connections[keys[i]];
  for (let j = i + 1; j < keys.length; j++) {
    const setB = connections[keys[j]];
    const intersection = [...setA.intersection(setB)].toSorted().join(',');
    intersections.add(intersection);
  }
}

let intersectionsByLength = [...intersections].toSorted((a, b) => b.length - a.length);
for (let intersection of intersectionsByLength) {
  let keys = intersection.split(',');
  if (allContainEachOther(keys)) {
    console.log(`Part 2: ${intersection}`);
    break;
  }
}

function allContainEachOther(keys) {
  for (let i = 0; i < keys.length - 1; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      let keyA = keys[i];
      let keyB = keys[j];
      if (!connections[keyA].has(keyB) || !connections[keyB].has(keyA)) return false;
    }
  }
  return true;
}