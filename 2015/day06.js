const fs = require("fs");

let input = fs.readFileSync("inputs/day06.txt", "utf8");
input = input.split("\n").map(line => {
  line = line.split(" ");
  let instruction, start, end;
  if (line.length === 4) {
    instruction = line[0];
    start = line[1].split(",");
    end = line[3].split(",");
  } else {
    instruction = line[1];
    start = line[2].split(",");
    end = line[4].split(",");
  }
  return {instruction, start, end};
});

function setUpGrid(dimension) {
  let grid = [];
  for (let i = 0; i < dimension; i++) {
    grid.push([]);
    for (let j = 0; j < dimension; j++) {
      grid[i].push(0);
    }
  }
  return grid;
}

let grid = setUpGrid(1000);

// Pt. 1
for (let instruction of input) {
  for (let i = Math.min(instruction.start[0], instruction.end[0]); i <= Math.max(instruction.end[0], instruction.start[0]); i++) {
    for (let j = Math.min(instruction.start[1], instruction.end[1]); j <= Math.max(instruction.end[1], instruction.start[1]); j++) {
      grid[i][j] = instruction.instruction === "on" ? 1 : instruction.instruction === "off" ? 0 : grid[i][j] === 0 ? 1 : 0;
    }
  }
}

let on = 0;

for (let row of grid) {
  for (let item of row) {
    if (item) {
      on++;
    }
  }
}

console.log(`Answer: ${on}`);

// Pt. 2

grid = setUpGrid(1000);

for (let instruction of input) {
  for (let i = Math.min(instruction.start[0], instruction.end[0]); i <= Math.max(instruction.end[0], instruction.start[0]); i++) {
    for (let j = Math.min(instruction.start[1], instruction.end[1]); j <= Math.max(instruction.end[1], instruction.start[1]); j++) {
      if (instruction.instruction === "on") {
        grid[i][j]++;
      } else if (instruction.instruction === "off" && grid[i][j] > 0) {
        grid[i][j]--;
      } else if (instruction.instruction === "toggle") {
        grid[i][j] += 2;
      }
    }
  }
}

let brightness = 0;

for (let row of grid) {
  for (let item of row) {
    if (item) {
      brightness += item;
    }
  }
}

console.log(`Answer: ${brightness}`);