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
