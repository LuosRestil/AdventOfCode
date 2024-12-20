import utils from "../utils.js";

console.time('time');

// parse input
const grid = utils
  .getInput("day20.txt")
  .split("\n")
  .map((line) => line.split(""));

// get race start pos
let startPos = utils.find2D(grid, 'S');

// set distance along path for each point in race
utils.gridSetPos(grid, startPos, 0);
let pos = startPos;
while (pos) {
  const curr = utils.gridGetPos(grid, pos);
  const neighbors = utils.getNeighbors(pos);
  pos = null;
  for (let neighbor of neighbors) {
    if (".E".includes(utils.gridGetPos(grid, neighbor))) {
      utils.gridSetPos(grid, neighbor, curr + 1);
      pos = neighbor;
      break;
    }
  }
}

function getCheats(maxDist) {
  let cheats = [];
  let pos = startPos;
  while (pos) {
    // find cheats for every position within manhattan distance of maxDist
    const curr = utils.gridGetPos(grid, pos);
    let neighbors = getAllNeighborsAtManhattanDistance(pos, maxDist);
    for (let neighbor of neighbors) {
      if (
        utils.isInGrid(grid, neighbor) &&
        utils.gridGetPos(grid, neighbor) !== "#"
      ) {
        const score = utils.gridGetPos(grid, neighbor) - curr;
        // arbitrary filter to keep memory use more manageable
        if (score > maxDist)
          cheats.push(score - utils.getManhattanDistance(pos, neighbor));
      }
    }
    // get next race position to find cheats for
    neighbors = utils.getNeighbors(pos);
    pos = null;
    for (let neighbor of neighbors) {
      if (
        utils.isInGrid(grid, neighbor) &&
        utils.gridGetPos(grid, neighbor) === curr + 1
      ) {
        pos = neighbor;
        break;
      }
    }
  }
  return cheats;
}

console.log(`Part 1: ${getCheats(2).filter((cheat) => cheat >= 100).length}`);
console.log(`Part 2: ${getCheats(20).filter(cheat => cheat >= 100).length}`);

console.timeEnd('time');

function getAllNeighborsAtManhattanDistance(pos, dist) {
  const neighbors = [];
  for (
    let row = pos[0] - dist, offset = 0;
    row <= pos[0] + dist;
    row++, offset = dist - Math.abs(pos[0] - row)
  ) {
    for (let col = pos[1] - offset; col <= pos[1] + offset; col++) {
      if (row === 0 && col === 0) continue;
      neighbors.push([row, col]);
    }
  }
  return neighbors;
}
