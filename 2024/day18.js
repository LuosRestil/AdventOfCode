import utils from "../utils.js";

const sample = false;
const filename = sample ? "day18sample.txt" : "day18.txt";
const dimensions = sample ? 7 : 71;

const bytes = utils
  .getInput(filename)
  .split("\n")
  .map((line) => line.split(",").map((num) => Number(num)));

solveForBytes(2879);

function solveForBytes(numBytes) {
  const grid = [...Array(dimensions)].map((_) => Array(dimensions).fill("."));

  for (let i = 0; i < numBytes; i++) {
    const byte = bytes[i];
    grid[byte[1]][byte[0]] = "#";
    if (i === numBytes - 1) console.log("lastByte: ", byte);
  }

  let queue = [[0, 0]];
  let seen = { "0:0": 0 };
  while (queue.length) {
    let pos = queue.pop();
    let posHashKey = utils.getHashKey(...pos);
    let posCost = seen[posHashKey];
    const neighbors = utils.getNeighbors(grid, pos);
    for (let neighbor of neighbors) {
      if (
        utils.isInGrid(grid, neighbor) &&
        utils.gridGetPos(grid, neighbor) !== "#"
      ) {
        const neighborHashKey = utils.getHashKey(...neighbor);
        if (
          seen[neighborHashKey] === undefined ||
          seen[neighborHashKey] > posCost + 1
        ) {
          seen[neighborHashKey] = posCost + 1;
          queue.push(neighbor);
        }
      }
    }
  }

  let target = [dimensions - 1, dimensions - 1];
  console.log(seen[utils.getHashKey(...target)]);
}
