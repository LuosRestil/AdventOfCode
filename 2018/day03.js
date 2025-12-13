import fs from 'fs';

console.time();

const claims = fs
  .readFileSync("inputs/day03.txt", "utf-8")
  .split("\n")
  .map((line) => {
    let sp = line.split(' ');
    let pos = sp[2].slice(0, sp[2].length - 1).split(',').map(num => parseInt(num));
    let dim = sp[3].split('x').map(num => parseInt(num));
    return {id: sp[0], pos, dim};
  });

const grid = makeGrid(1000);
for (let claim of claims) {
  for (let i = claim.pos[0]; i < claim.pos[0] + claim.dim[0]; i++) {
    for (let j = claim.pos[1]; j < claim.pos[1] + claim.dim[1]; j++) {
      grid[i][j] = grid[i][j] === '.' ? '!' : 'x';
    }
  }
}

let overlap = 0;
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid.length; j++) {
    if (grid[i][j] === 'x') overlap++;
  }
}
console.log(`Part 1: ${overlap}`);

for (let claim of claims) {
  if (!overlaps(claim, grid)) {
    console.log(`Part 2: ${claim.id}`);
    break;
  }
}

console.timeEnd();

function overlaps(claim, grid) {
  for (let i = claim.pos[0]; i < claim.pos[0] + claim.dim[0]; i++) {
    for (let j = claim.pos[1]; j < claim.pos[1] + claim.dim[1]; j++) {
      if (grid[i][j] === 'x') return true;
    }
  }
  return false;
}

function makeGrid(dim) {
  let grid = [];
  for (let i = 0; i < dim; i++) {
    let row = [];
    for (let j = 0; j < dim; j++) {
      row.push(".");
    }
    grid.push(row);
  }
  return grid;
}
