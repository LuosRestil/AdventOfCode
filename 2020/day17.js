const { getInput } = require('../utils');

let input = getInput('day17.txt');

// for 3d
// input = [input.split("\n").map((item) => item.split(""))];

// for 4d
input = [[input.split("\n").map((item) => item.split(""))]];

function expandGrid(grid) {
  let rowlen;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j].push(".");
      grid[i][j].unshift(".");
    }
    rowlen = grid[i][0].length;
    grid[i].push([]);
    grid[i].unshift([]);
    for (let j = 0; j < rowlen; j++) {
      grid[i][0].push(".");
      grid[i][grid[i].length - 1].push(".");
    }
  }

  grid.push([]);
  grid.unshift([]);
  for (let i = 0; i < grid[1].length; i++) {
    grid[0].push([]);
    grid[grid.length - 1].push([]);
  }
  for (let i = 0; i < grid[0].length; i++) {
    for (let j = 0; j < rowlen - 1; j++) {
      grid[0][i].push(".");
      grid[grid.length - 1][i].push(".");
    }
    grid[0][i].push(".");
    grid[grid.length - 1][i].push(".");
  }
}

function mustExpand(grid) {
  // check all of outer dimensions
  for (let i = 0; i < grid[0].length; i++) {
    for (let j = 0; j < grid[0][0].length; j++) {
      if (grid[0][i][j] === "#" || grid[grid.length - 1][i][j] === "#") {
        // console.log("# found in outer dimensions");
        return true;
      }
    }
  }
  // check inner dimensions
  // each block
  for (let i = 1; i < grid.length - 1; i++) {
    // each row of block
    for (let j = 0; j < grid[i].length; j++) {
      if (j === 0 || j === grid[i].length - 1) {
        // check all
        for (let k = 0; k < grid[i][j].length; k++) {
          if (grid[i][j][k] === "#") {
            // console.log(
            //   `# found in inner first or last row of inner dimension, ${i}, ${j}, ${k}`
            // );
            return true;
          }
        }
      } else {
        // check first and last only
        if (
          grid[i][j][0] === "#" ||
          grid[i][j][grid[i][j].length - 1] === "#"
        ) {
          // console.log(
          //   `grid[${i}][${j}][0] or grid[${i}][${j}][${
          //     grid[i][j].length - 1
          //   }] === #`
          // );
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * @param {number} block - Block
 * @param {number} row - Row
 * @param {number} cube - Cube
 * @param {string[][][]} - Three-dimensional grid
 * @param {Map} activityRecord - Record of inspected cubes
 * @returns {Object} - {active: number, inactive: number}
 * add object to keep track of blocks previously viewed?
 */
function checkAdjacent(block, row, cube, grid, activityRecord) {
  let activeAdjacent = 0;
  for (let i = block - 1; i <= block + 1; i++) {
    for (let j = row - 1; j <= row + 1; j++) {
      for (let k = cube - 1; k <= cube + 1; k++) {
        if (i === block && j === row && k === cube) {
          continue;
        }
        if (grid[i] && grid[i][j]) {
          let hash = 0;
          hash = hash * 31 + i;
          hash = hash * 31 + j;
          hash = hash * 31 + k;
          hash = `${hash}`;
          if (activityRecord.has(hash)) {
            if (activityRecord.get(hash) === "active") {
              activeAdjacent++;
            }
          } else {
            let curr = grid[i][j][k];
            if (curr === "#" || curr === "i") {
              activeAdjacent++;
              activityRecord.set(hash, "active");
            } else if (curr === "." || curr === "a") {
              activityRecord.set(hash, "inactive");
            }
          }
        }
      }
    }
  }
  return activeAdjacent;
}

function normalize(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      for (let k = 0; k < grid[i][j].length; k++) {
        if (grid[i][j][k] === "i") {
          grid[i][j][k] = ".";
        } else if (grid[i][j][k] === "a") {
          grid[i][j][k] = "#";
        }
      }
    }
  }
}

// uncomment below to run part 1

// for (let cycle = 0; cycle < 6; cycle++) {
//   let activityRecord = new Map();
//   if (mustExpand(input)) {
//     expandGrid(input);
//   }
//   for (let i = 0; i < input.length; i++) {
//     for (let j = 0; j < input[i].length; j++) {
//       for (let k = 0; k < input[i][j].length; k++) {
//         // console.log(`checking ${i}, ${j}, ${k}: ${input[i][j][k]}`);
//         let activeAdjacent = checkAdjacent(i, j, k, input, activityRecord);
//         // console.log(`activeAdjacent: ${activeAdjacent}`);
//         if (
//           input[i][j][k] === "#" &&
//           activeAdjacent !== 2 &&
//           activeAdjacent !== 3
//         ) {
//           input[i][j][k] = "i";
//           // console.log("turning inactive");
//         }
//         if (input[i][j][k] === "." && activeAdjacent === 3) {
//           input[i][j][k] = "a";
//           // console.log("turning active");
//         }
//       }
//     }
//   }
//   normalize(input);
// }

// let totalActive = 0;
// for (let i = 0; i < input.length; i++) {
//   for (let j = 0; j < input[i].length; j++) {
//     for (let k = 0; k < input[i][j].length; k++) {
//       if (input[i][j][k] === "#") {
//         totalActive++;
//       }
//     }
//   }
// }
// console.log(`Answer: ${totalActive}`);

// *********************************************************************************

function checkAdjacent4d(dimension, block, row, cube, grid, activityRecord) {
  let activeAdjacent = 0;
  for (let x = dimension - 1; x <= dimension + 1; x++) {
    for (let i = block - 1; i <= block + 1; i++) {
      for (let j = row - 1; j <= row + 1; j++) {
        for (let k = cube - 1; k <= cube + 1; k++) {
          if (x === dimension && i === block && j === row && k === cube) {
            continue;
          }
          if (grid[x] && grid[x][i] && grid[x][i][j]) {
            let hash = 0;
            hash = hash * 31 + x;
            hash = hash * 31 + i;
            hash = hash * 31 + j;
            hash = hash * 31 + k;
            hash = `${hash}`;
            if (activityRecord.has(hash)) {
              if (activityRecord.get(hash) === "active") {
                activeAdjacent++;
              }
            } else {
              let curr = grid[x][i][j][k];
              if (curr === "#" || curr === "i") {
                activeAdjacent++;
                activityRecord.set(hash, "active");
              } else if (curr === "." || curr === "a") {
                activityRecord.set(hash, "inactive");
              }
            }
          }
        }
      }
    }
  }
  return activeAdjacent;
}

function normalize4d(grid) {
  for (let x = 0; x < grid.length; x++) {
    for (let i = 0; i < grid[x].length; i++) {
      for (let j = 0; j < grid[x][i].length; j++) {
        for (let k = 0; k < grid[x][i][j].length; k++) {
          if (grid[x][i][j][k] === "i") {
            grid[x][i][j][k] = ".";
          } else if (grid[x][i][j][k] === "a") {
            grid[x][i][j][k] = "#";
          }
        }
      }
    }
  }
}

function mustExpand4d(grid) {
  return true;
}

function expandGrid4d(grid) {
  for (let dimension = 0; dimension < grid.length; dimension++) {
    expandGrid(grid[dimension]);
  }
  grid.push(grid[0].map((plane) => plane.map((row) => row.map((item) => "."))));
  grid.unshift(
    grid[0].map((plane) => plane.map((row) => row.map((item) => ".")))
  );
}

for (let cycle = 0; cycle < 6; cycle++) {
  let activityRecord = new Map();
  if (mustExpand4d(input)) {
    expandGrid4d(input);
  }
  for (let x = 0; x < input.length; x++) {
    for (let i = 0; i < input[x].length; i++) {
      for (let j = 0; j < input[x][i].length; j++) {
        for (let k = 0; k < input[x][i][j].length; k++) {
          // console.log(`checking ${i}, ${j}, ${k}: ${input[i][j][k]}`);
          let activeAdjacent = checkAdjacent4d(
            x,
            i,
            j,
            k,
            input,
            activityRecord
          );
          // console.log(`activeAdjacent: ${activeAdjacent}`);
          if (
            input[x][i][j][k] === "#" &&
            activeAdjacent !== 2 &&
            activeAdjacent !== 3
          ) {
            input[x][i][j][k] = "i";
            // console.log("turning inactive");
          }
          if (input[x][i][j][k] === "." && activeAdjacent === 3) {
            input[x][i][j][k] = "a";
            // console.log("turning active");
          }
        }
      }
    }
  }
  normalize4d(input);
}

// for (let dimension of input) {
//   console.log(dimension);
// }

let totalActive = 0;
for (let x = 0; x < input.length; x++) {
  for (let i = 0; i < input[x].length; i++) {
    for (let j = 0; j < input[x][i].length; j++) {
      for (let k = 0; k < input[x][i][j].length; k++) {
        if (input[x][i][j][k] === "#") {
          totalActive++;
        }
      }
    }
  }
}

console.log(`Answer: ${totalActive}`);
