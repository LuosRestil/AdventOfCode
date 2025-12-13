console.time('exec');
import fs from 'fs';

let input = fs.readFileSync('inputs/day18.txt', 'utf-8').split('\n').map(row => row.split(""));

function updateLights(grid) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      let neighborsOn = getNeighborsOn(grid, row, col);
      if (grid[row][col] === "#" && (neighborsOn !== 2 && neighborsOn !== 3)) {
        grid[row][col] = "1";
      } else if (grid[row][col] === "." && neighborsOn === 3) {
        grid[row][col] = "0";
      }
    }
  }

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "1") {
        grid[row][col] = ".";
      }
      if (grid[row][col] === "0") {
        grid[row][col] = "#";
      }
    }
  }

  // uncomment for part 2
  // grid[0][0] = "#";
  // grid[0][grid[0].length - 1] = "#";
  // grid[grid.length - 1][0] = "#";
  // grid[grid.length - 1][grid[0].length - 1] = "#";

}

function getNeighborsOn(grid, row, col) {
  let totalOn = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < grid.length &&
        j >= 0 && j < grid[0].length &&
        (i !== row || j !== col)) {
        if (grid[i][j] === "#" || grid[i][j] === "1") {
          totalOn++;
        }
      }
    }
  }
  return totalOn;
}

for (let i = 0; i < 100; i++) {
  updateLights(input);
}

let totalOn = 0;
for (let row = 0; row < input.length; row++) {
  for (let col = 0; col < input[0].length; col++) {
    if (input[row][col] === "#") {
      totalOn++;
    }
  }
}

console.log(`Answer: ${totalOn}`);

console.timeEnd('exec');