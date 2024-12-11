const fs = require("fs");
const input = fs.readFileSync("inputs/day16.txt", { encoding: "utf-8" });
const grid = input.split("\n").map((row) => row.split(""));

console.log("Answer 1: " + energizeGrid(0, 0, "right"));

let max = -1;
for (let row = 0; row < grid.length; row++) {
  let energized = energizeGrid(row, 0, "right");
  if (energized > max) max = energized;
  energized = energizeGrid(row, grid[0].length - 1, "left");
  if (energized > max) max = energized;
}
for (let col = 0; col < grid[0].length; col++) {
  let energized = energizeGrid(0, col, "down");
  if (energized > max) max = energized;
  energized = energizeGrid(0, grid.length - 1, "up");
  if (energized > max) max = energized;
}
console.log("Answer 2: " + max);


const backslashMap = {
  up: "left",
  down: "right",
  right: "down",
  left: "up",
};
const slashMap = {
  up: "right",
  down: "left",
  right: "up",
  left: "down",
};

function energizeGrid(startRow, startCol, startDir) {
  const visited = new Map();
  let beams = [];
  beams.push({
    direction: startDir,
    pos: [startRow, startCol],
    isActive: true,
  });
  while (beams.length) {
    for (let i = beams.length - 1; i >= 0; i--) {
      const beam = beams[i];
      if (visited.has(`${beam.pos[0]}:${beam.pos[1]}`)) {
        const val = visited.get(`${beam.pos[0]}:${beam.pos[1]}`);
        if (val.includes(beam.direction)) {
          beam.isActive = false;
          continue;
        }
        val.push(beam.direction);
      } else {
        visited.set(`${beam.pos[0]}:${beam.pos[1]}`, [beam.direction]);
      }
      const char = grid[beam.pos[0]][beam.pos[1]];
      if (char === "\\") {
        beam.direction = backslashMap[beam.direction];
      } else if (char === "/") {
        beam.direction = slashMap[beam.direction];
      } else if (
        char === "|" &&
        (beam.direction === "left" || beam.direction === "right")
      ) {
        beam.isActive = false;
        beams.push({
          direction: "up",
          pos: [beam.pos[0], beam.pos[1]],
          isActive: true,
        });
        beams.push({
          direction: "down",
          pos: [beam.pos[0], beam.pos[1]],
          isActive: true,
        });
      } else if (
        char === "-" &&
        (beam.direction === "up" || beam.direction === "down")
      ) {
        beam.isActive = false;
        beams.push({
          direction: "left",
          pos: [beam.pos[0], beam.pos[1]],
          isActive: true,
        });
        beams.push({
          direction: "right",
          pos: [beam.pos[0], beam.pos[1]],
          isActive: true,
        });
      }
    }
    for (let beam of beams) {
      switch (beam.direction) {
        case "up":
          beam.pos[0]--;
          break;
        case "down":
          beam.pos[0]++;
          break;
        case "left":
          beam.pos[1]--;
          break;
        case "right":
          beam.pos[1]++;
          break;
        default:
          console.log("oh god oh fuck");
      }
    }

    beams = beams.filter(
      (beam) => beam.isActive && !!grid[beam.pos[0]]?.[beam.pos[1]]
    );
  }
  return visited.size;
}
