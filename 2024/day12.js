const { getInput, isOnGrid, getHashKey } = require("../utils");

const grid = getInput("day12.txt").split("\n");
const seen = new Set();
const regions = [];

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    if (!seen.has(getHashKey(row, col))) {
      processRegion(row, col);
    }
  }
}

let price = 0;
for (let region of regions) {
  price += region.area * Object.keys(region.edges).length;
}
console.log(`Part 1: ${price}`);

price = 0;
for (let region of regions) {
  const regionSides = countSides(region);
  price += region.area * regionSides;
}
console.log(`Part 2: ${price}`);

function processRegion(row, col) {
  const region = { perimeter: 0, area: 0, edges: {} };
  const crop = grid[row][col];
  region.crop = crop;
  const queue = [[row, col]];
  while (queue.length) {
    const curr = queue.pop();
    const hashKey = getHashKey(curr[0], curr[1]);
    if (seen.has(hashKey)) continue;
    seen.add(hashKey);
    region.area++;

    const neighbors = [
      { loc: [curr[0] - 1, curr[1]], dir: "u" },
      { loc: [curr[0] + 1, curr[1]], dir: "d" },
      { loc: [curr[0], curr[1] - 1], dir: "l" },
      { loc: [curr[0], curr[1] + 1], dir: "r" },
    ];

    for (let cell of neighbors) {
      if (
        !isOnGrid(grid, cell.loc[0], cell.loc[1]) ||
        grid[cell.loc[0]][cell.loc[1]] !== crop
      ) {
        // add edge
        let idx;
        switch (cell.dir) {
          case "u":
            idx = curr[0];
            break;
          case "d":
            idx = curr[0] + 1;
            break;
          case "l":
            idx = curr[1];
            break;
          case "r":
            idx = curr[1] + 1;
            break;
        }
        const from = cell.dir === "u" || cell.dir === "d" ? curr[1] : curr[0];
        const to =
          cell.dir === "u" || cell.dir === "d" ? curr[1] + 1 : curr[0] + 1;
        region.edges[getHashKey(cell.dir, idx, from, to)] = {
          dir: cell.dir,
          idx,
          from,
          to,
          groupId: 0,
        };
      } else if (!seen.has(getHashKey(cell.loc[0], cell.loc[1]))) {
        queue.push([cell.loc[0], cell.loc[1]]);
      }
    }
  }
  regions.push(region);
}

function countSides(region) {
  let nextGroupId = 1;
  for (let edge of Object.values(region.edges)) {
    if (edge.groupId) continue;
    edge.groupId = nextGroupId++;
    let curr = edge;
    let dir1 =
      region.edges[getHashKey(curr.dir, curr.idx, curr.from - 1, curr.from)];
    while (dir1) {
      dir1.groupId = edge.groupId;
      curr = dir1;
      dir1 =
        region.edges[getHashKey(curr.dir, curr.idx, curr.from - 1, curr.from)];
    }
    let dir2 =
      region.edges[getHashKey(curr.dir, curr.idx, curr.to, curr.to + 1)];
    while (dir2) {
      dir2.groupId = edge.groupId;
      curr = dir2;
      dir2 =
        region.edges[getHashKey(curr.dir, curr.idx, curr.to, curr.to + 1)];
    }
  }
  return nextGroupId - 1;
}
