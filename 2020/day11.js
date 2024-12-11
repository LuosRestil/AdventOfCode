const { getInput } = require('../utils');

let input = getInput('day11.txt')
  .split('\n')
  .map(row => row.split(''));

// function countOccupiedAdjacent(row, col) {
//     let total = 0;
//     if (input[row - 1]) {
//         const ul = input[row - 1][col - 1];
//         if (ul === "#" || ul === "1") {
//             total ++;
//         }
//         const u = input[row - 1][col];
//         if (u === "#" || u === "1") {
//             total ++;
//         }
//         const ur = input[row - 1][col + 1];
//         if (ur === "#" || ur === "1") {
//             total ++;
//         }
//     }

//     const l = input[row][col - 1];
//     if (l === "#" || l === "1") {
//         total ++;
//     }

//     const r = input[row][col + 1];
//     if (r === "#" || r === "1") {
//         total ++;
//     }

//     if (input[row + 1]) {
//         const dr = input[row + 1][col + 1];
//         if (dr === "#" || dr === "1") {
//             total ++;
//         }
//         const d = input[row + 1][col];
//         if (d === "#" || d === "1") {
//             total ++;
//         }
//         const dl = input[row + 1][col - 1];
//         if (dl === "#" || dl === "1") {
//             total ++;
//         }
//     }
//     return total;
// }

// let stable = false;
// while (!stable) {
//     stable = true;

//     // for (let i = 0; i < input.length; i++) {
//     //     console.log(input[i].join(""));
//     // }
//     // console.log("\n$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n");

//     for (let i = 0; i < input.length; i++) {
//         for (let j = 0; j < input[i].length; j++) {
//             const curr = input[i][j];
//             const numAdjacent = countOccupiedAdjacent(i, j);
//             if (curr === "L" && numAdjacent === 0) {
//                 input[i][j] = "0";
//                 stable = false;
//                 continue;
//             }
//             if (curr === "#" && numAdjacent >= 4) {
//                 input[i][j] = "1"
//                 stable = false;
//                 continue;
//             }
//         }
//     }
//     input = input.map(row => row.map(item => item === "0" ? "#" : item === "1" ? "L" : item));
// }

// // console.log(input.map(row => row.join("")));

// let occupied = 0;
// for (let i = 0; i < input.length; i++) {
//     // console.log(input[i].join(""));
//     for (let j = 0; j < input[i].length; j++) {
//         // console.log(input[i][j]);
//         if (input[i][j] === "#") {
//             occupied++;
//         }
//     }
// }

// console.log(`Answer: ${occupied}`);

// *****************************************************************

function countOccupiedVisible(row, col) {
  let total = 0;

  function ul(i, j) {
    i--;
    j--;
    while (i >= 0 && i < input.length && j >= 0 && j < input[i].length) {
      if (input[i][j] === "#" || input[i][j] === "1") {
        return true;
      } else if (input[i][j] === "L" || input[i][j] === "0") {
        return false;
      }

      i--;
      j--;
    }
    return false;
  }

  function u(i, j) {
    i--;
    while (i >= 0 && i < input.length && j >= 0 && j < input[i].length) {
      if (input[i][j] === "#" || input[i][j] === "1") {
        return true;
      } else if (input[i][j] === "L" || input[i][j] === "0") {
        return false;
      }

      i--;
    }
    return false;
  }
  function ur(i, j) {
    i--;
    j++;
    while (i >= 0 && i < input.length && j >= 0 && j < input[i].length) {
      if (input[i][j] === "#" || input[i][j] === "1") {
        return true;
      } else if (input[i][j] === "L" || input[i][j] === "0") {
        return false;
      }

      i--;
      j++;
    }
    return false;
  }
  function r(i, j) {
    j++;
    while (i >= 0 && i < input.length && j >= 0 && j < input[i].length) {
      if (input[i][j] === "#" || input[i][j] === "1") {
        return true;
      } else if (input[i][j] === "L" || input[i][j] === "0") {
        return false;
      }

      j++;
    }
    return false;
  }
  function dr(i, j) {
    i++;
    j++;
    while (i >= 0 && i < input.length && j >= 0 && j < input[i].length) {
      if (input[i][j] === "#" || input[i][j] === "1") {
        return true;
      } else if (input[i][j] === "L" || input[i][j] === "0") {
        return false;
      }

      i++;
      j++;
    }
    return false;
  }
  function d(i, j) {
    i++;
    while (i >= 0 && i < input.length && j >= 0 && j < input[i].length) {
      if (input[i][j] === "#" || input[i][j] === "1") {
        return true;
      } else if (input[i][j] === "L" || input[i][j] === "0") {
        return false;
      }

      i++;
    }
    return false;
  }
  function dl(i, j) {
    i++;
    j--;
    while (i >= 0 && i < input.length && j >= 0 && j < input[i].length) {
      if (input[i][j] === "#" || input[i][j] === "1") {
        return true;
      } else if (input[i][j] === "L" || input[i][j] === "0") {
        return false;
      }

      i++;
      j--;
    }
    return false;
  }
  function l(i, j) {
    j--;
    while (i >= 0 && i < input.length && j >= 0 && j < input[i].length) {
      if (input[i][j] === "#" || input[i][j] === "1") {
        return true;
      } else if (input[i][j] === "L" || input[i][j] === "0") {
        return false;
      }

      j--;
    }
    return false;
  }
  if (ul(row, col)) total++;
  if (u(row, col)) total++;
  if (ur(row, col)) total++;
  if (r(row, col)) total++;
  if (dr(row, col)) total++;
  if (d(row, col)) total++;
  if (dl(row, col)) total++;
  if (l(row, col)) total++;
  return total;
}

let stable = false;
while (!stable) {
  stable = true;

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      const curr = input[i][j];
      const numVisible = countOccupiedVisible(i, j);
      if (curr === "L" && numVisible === 0) {
        input[i][j] = "0";
        stable = false;
        continue;
      }
      if (curr === "#" && numVisible >= 5) {
        input[i][j] = "1";
        stable = false;
        continue;
      }
    }
  }
  input = input.map((row) =>
    row.map((item) => (item === "0" ? "#" : item === "1" ? "L" : item))
  );
}

let occupied = 0;
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[i].length; j++) {
    if (input[i][j] === "#") {
      occupied++;
    }
  }
}

console.log(`Answer: ${occupied}`);
