const fs = require('fs');
const input = fs.readFileSync('inputs/day14.txt', {encoding: 'utf-8'});
const grid = input.split('\n').map(row => row.split(''));

tiltNorth();
console.log('Answer 1: ' + calculateNorthBeamLoad());

const res = {};
for (let i = 0; i < 1000; i++) {
  tiltNorth();
  tiltWest();
  tiltSouth();
  tiltEast();
  const northBeamLoad = calculateNorthBeamLoad();
  if (res[northBeamLoad]) res[northBeamLoad].push(i);
  else res[northBeamLoad] = [i];
}



/*
const cycleIndex = ((targetIndex - preCycleLength) % cycleLength) - 1;

sample (dig through res manually to find cycle for sample)
targetIndex = 1_000_000_000;
preCycleLength = 2;
cycleLength = 7;

*/


// real input
for (let key of Object.keys(res)) {
  if (res[key].length <= 2) delete res[key];
}
const cycle = Object.entries(res).sort((a, b) => a[1][0] - b[1][0]);
const targetIndex = 1_000_000_000;
const preCycleLength = cycle[0][1][0];
const cycleLength = cycle.length;
const idx = ((targetIndex - preCycleLength) % cycleLength) - 1;
const ans = cycle[idx][0];
console.log('Answer 2: ' + ans);

function tiltNorth() {
  for (let col = 0; col < grid[0].length; col++) {
    let lastHash = -1;
    let boulders = 0;
    for (let row = 0; row < grid.length; row++) {
      const char = grid[row][col];
      if (char === "O") boulders++;
      if (char === "#") {
        for (let i = lastHash + 1; i < row; i++) {
          if (boulders) {
            grid[i][col] = "O";
            boulders--;
          } else {
            grid[i][col] = ".";
          }
        }
        lastHash = row;
      }
    }
    for (let i = lastHash + 1; i < grid.length; i++) {
      if (boulders) {
        grid[i][col] = "O";
        boulders--;
      } else {
        grid[i][col] = ".";
      }
    }
  }
}

function tiltSouth() {
  for (let col = 0; col < grid[0].length; col++) {
    let lastHash = grid.length;
    let boulders = 0;
    for (let row = grid.length - 1; row >= 0; row--) {
      const char = grid[row][col];
      if (char === "O") boulders++;
      if (char === "#") {
        for (let i = lastHash - 1; i > row; i--) {
          if (boulders) {
            grid[i][col] = "O";
            boulders--;
          } else {
            grid[i][col] = ".";
          }
        }
        lastHash = row;
      }
    }
    for (let i = lastHash - 1; i >=0 ; i--) {
      if (boulders) {
        grid[i][col] = "O";
        boulders--;
      } else {
        grid[i][col] = ".";
      }
    }
  }
}

function tiltWest() {
  for (let row = 0; row < grid.length; row++) {
    let lastHash = -1;
    let boulders = 0;
    for (let col = 0; col < grid[0].length; col++) {
      const char = grid[row][col];
      if (char === "O") boulders++;
      if (char === "#") {
        for (let i = lastHash + 1; i < col; i++) {
          if (boulders) {
            grid[row][i] = "O";
            boulders--;
          } else {
            grid[row][i] = ".";
          }
        }
        lastHash = col;
      }
    }
    for (let i = lastHash + 1; i < grid[0].length; i++) {
      if (boulders) {
        grid[row][i] = "O";
        boulders--;
      } else {
        grid[row][i] = ".";
      }
    }
  }
}

function tiltEast() {
  for (let row = 0; row < grid.length; row++) {
    let lastHash = grid[0].length;
    let boulders = 0;
    for (let col = grid[0].length - 1; col >= 0; col--) {
      const char = grid[row][col];
      if (char === "O") boulders++;
      if (char === "#") {
        for (let i = lastHash - 1; i > col; i--) {
          if (boulders) {
            grid[row][i] = "O";
            boulders--;
          } else {
            grid[row][i] = ".";
          }
        }
        lastHash = col;
      }
    }
    for (let i = lastHash - 1; i >= 0; i--) {
      if (boulders) {
        grid[row][i] = "O";
        boulders--;
      } else {
        grid[row][i] = ".";
      }
    }
  }
}

function calculateNorthBeamLoad() {
  let total = 0;
  for (let i = grid.length - 1, j = 1; i >= 0; i--, j++) {
    total += countBoulders(grid[i]) * j;
  }
  return total;
}

function countBoulders(row) {
  let count = 0;
  for (let char of row) {
    if (char === "O") count++;
  }
  return count;
}

function printGrid() {
  grid.forEach(row => console.log(row.join("")));
}