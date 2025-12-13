import { getInput, getHashKey, find2D, pointsAreEqual } from "../utils.js";

let codes = getInput("day21.txt").split("\n");

let numPad = `
#####
#789#
#456#
#123#
##0A#
#####
`;
numPad = numPad
  .split("\n")
  .slice(1, numPad.length - 1)
  .map((row) => row.split(""));
let dirPad = `
#####
##^A#
#<v>#
#####
`;
dirPad = dirPad
  .split("\n")
  .slice(1, dirPad.length - 1)
  .map((row) => row.split(""));

let shortestPathsNumPad = getShortestPaths(numPad, "1234567890A".split(""));
let shortestPathsDirPad = getShortestPaths(dirPad, "<>^vA".split(""));

let total = 0;
for (let code of codes) {
  let firstRobotSeqs = robotPushSeq(code, shortestPathsNumPad);
  let secondRobotSeqs = firstRobotSeqs
    .map((seq) => robotPushSeq(seq, shortestPathsDirPad))
    .flat();
  let thirdRobotSeqs = secondRobotSeqs
    .map((seq) => robotPushSeq(seq, shortestPathsDirPad))
    .flat();
  thirdRobotSeqs.sort((a, b) => a.length - b.length);
  total += thirdRobotSeqs[0].length * parseInt(code);
}
console.log(`Part 1: ${total}`);

function robotPushSeq(seq, pad) {
  let paths = [""];
  for (let i = 0; i < seq.length; i++) {
    let nextPaths = [];
    let hashKey = getHashKey(i === 0 ? "A" : seq[i - 1], seq[i]);
    let stepPaths = pad[getHashKey(i === 0 ? "A" : seq[i - 1], seq[i])];
    if (!stepPaths) {
      console.log("well fuck");
    }
    stepPaths = stepPaths.map((path) => path + "A");
    for (let path of paths) {
      for (let sp of stepPaths) {
        nextPaths.push(path + sp);
      }
    }
    paths = nextPaths;
  }
  return paths;
}

function getShortestPaths(grid, chars) {
  let map = {};
  for (let a of chars) {
    for (let b of chars) {
      map[getHashKey(a, b)] = getShortestPathsBetween(a, b, grid);
    }
  }
  return map;
}

function getShortestPathsBetween(a, b, grid) {
  let aPos = find2D(grid, a);
  let bPos = find2D(grid, b);
  const seen = { [a]: { paths: [""], cost: 0 } };
  let queue = [{ ...seen[a], pos: aPos }];
  while (queue.length) {
    let curr = queue.shift();
    if (pointsAreEqual(curr.pos, bPos)) {
      continue;
    }
    // up
    let up = [curr.pos[0] - 1, curr.pos[1]];
    let upChar = grid[up[0]][up[1]];
    if (upChar !== "#") {
      if (!seen[upChar] || seen[upChar].cost > curr.cost + 1) {
        seen[upChar] = {
          paths: curr.paths.map((path) => path + "^"),
          cost: curr.cost + 1,
        };
        queue.push({ ...seen[upChar], pos: up });
      } else if (seen[upChar] && seen[upChar].cost === curr.cost + 1) {
        for (let path of curr.paths) {
          seen[upChar].paths.push(path + "^");
        }
      }
    }
    // down
    let down = [curr.pos[0] + 1, curr.pos[1]];
    let downChar = grid[down[0]][down[1]];
    if (downChar !== "#") {
      if (!seen[downChar] || seen[downChar].cost > curr.cost + 1) {
        seen[downChar] = {
          paths: curr.paths.map((path) => path + "v"),
          cost: curr.cost + 1,
        };
        queue.push({ ...seen[downChar], pos: down });
      } else if (seen[downChar] && seen[downChar].cost === curr.cost + 1) {
        for (let path of curr.paths) {
          seen[downChar].paths.push(path + "v");
        }
      }
    }
    // left
    let left = [curr.pos[0], curr.pos[1] - 1];
    let leftChar = grid[left[0]][left[1]];
    if (leftChar !== "#") {
      if (!seen[leftChar] || seen[leftChar].cost > curr.cost + 1) {
        seen[leftChar] = {
          paths: curr.paths.map((path) => path + "<"),
          cost: curr.cost + 1,
        };
        queue.push({ ...seen[leftChar], pos: left });
      } else if (seen[leftChar] && seen[leftChar].cost === curr.cost + 1) {
        for (let path of curr.paths) {
          seen[leftChar].paths.push(path + "<");
        }
      }
    }
    // right
    let right = [curr.pos[0], curr.pos[1] + 1];
    let rightChar = grid[right[0]][right[1]];
    if (rightChar !== "#") {
      if (!seen[rightChar] || seen[rightChar].cost > curr.cost + 1) {
        seen[rightChar] = {
          paths: curr.paths.map((path) => path + ">"),
          cost: curr.cost + 1,
        };
        queue.push({ ...seen[rightChar], pos: right });
      } else if (seen[rightChar] && seen[rightChar].cost === curr.cost + 1) {
        for (let path of curr.paths) {
          seen[rightChar].paths.push(path + ">");
        }
      }
    }
  }
  return seen[b].paths;
}
