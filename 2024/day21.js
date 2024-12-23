import utils from "../utils.js";

let codes = utils.getInput("day21sample.txt").split("\n");

let numPad = `
#####
#789#
#456#
#123#
##0A#
#####
`;
numPad = numPad.split('\n').slice(1, numPad.length - 1).map(row => row.split(''));
let dirPad = `
#####
# ^A#
#<v>#
#####
`;

function getShortestPaths(grid, chars) {
  let map = {};
  for (let a of chars) {
    for (let b of chars) {
      if (a !== b) {
        map[utils.getHashKey(a, b)] = getShortestPathsBetween(a, b, grid);
      }
    }
  }
  return map;
}

function getShortestPathsBetween(a, b, grid) {
  let aPos = utils.gridGetPos(grid, a);
  let bPos = utils.gridGetPos(grid, b);
  let seen = {[utils.getHashKey(aPos)]: {cost: 0, paths: []}};
  let queue = [aPos];
  while (queue.length) {
    let pos = queue.shift();
    if (utils.pointsAreEqual(pos, bPos)) {
      continue;
    }
    // up
    let up = [pos[0] - 1, pos[1]];
    // down
    let down = [pos[0] + 1, pos[1]];
    // left
    let left = [pos[0], pos[1] - 1];
    // right
    let right = [pos[0], pos[1] + 1];
  }
}