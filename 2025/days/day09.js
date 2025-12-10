const fs = require("fs");

console.time();

const HORIZ = 1;
const VERT = 2;

let tiles = fs.readFileSync("inputs/day09.txt", "utf-8")
  .split("\n")
  .map((line) => line.split(",").map((num) => parseInt(num)));
let lines = [];
for (let i = 0; i < tiles.length - 1; i++) lines.push([tiles[i], tiles[i + 1]]);
lines.push([tiles[0], tiles.at(-1)]);

let maxSize = 0;
let maxGreenSize = 0;
for (let i = 0; i < tiles.length - 1; i++) {
  for (let j = i + 1; j < tiles.length; j++) {
    let a = tiles.at(i);
    let b = tiles[j];
    let size = (Math.abs(a[0] - b[0]) + 1) * (Math.abs(a[1] - b[1]) + 1);
    if (size > maxSize) maxSize = size;
    if (isGreen(a, b, lines) && size > maxGreenSize) maxGreenSize = size;
  }
}
console.log(`Part 1: ${maxSize}`);
console.log(`Part 2: ${maxGreenSize}`);

console.timeEnd();

function isGreen(a, b, lines) {
  let minX = Math.min(a[0], b[0]);
  let maxX = Math.max(a[0], b[0]);
  let minY = Math.min(a[1], b[1]);
  let maxY = Math.max(a[1], b[1]);

  let topLeft = [minX, minY];
  let bottomRight = [maxX, maxY];
  let tlInt = { left: null, right: null, up: null, down: null };
  let brInt = { left: null, right: null, up: null, down: null };

  for (let line of lines) {
    // VERTICALS
    if (getLineType(line) == VERT) {
      // top left
      if (between(topLeft[1], line[0][1], line[1][1], true)) {
        // intersection found
        let intersection = [line[0][0], topLeft[1]];
        let onLineEnd =
          intersection[1] == line[0][1] || intersection[1] == line[1][1];
        if (intersection[0] <= topLeft[0]) {
          // left
          tlInt.left = { intersection, inside: !onLineEnd };
        }
        if (intersection[0] > topLeft[0]) {
          // right
          if (
            tlInt.right === null ||
            pointsEqual(tlInt.right.intersection, topLeft)
          ) {
            tlInt.right = { intersection, inside: !onLineEnd };
          } else {
            // short or long based on inside or outside
            if (onLineEnd) {
              if (
                !tlInt.right.inside &&
                tlInt.right.intersection[0] < intersection[0]
              )
                tlInt.right = { intersection, inside: !onLineEnd };
            } else {
              if (
                !tlInt.right.inside ||
                tlInt.right.intersection[0] > intersection[0]
              )
                tlInt.right = { intersection, inside: !onLineEnd };
            }
          }
        }
      }

      // bottom right
      if (between(bottomRight[1], line[0][1], line[1][1], true)) {
        // intersection found
        let intersection = [line[0][0], bottomRight[1]];
        let onLineEnd =
          intersection[1] == line[0][1] || intersection[1] == line[1][1];
        if (intersection[0] < bottomRight[0]) {
          // left
          if (
            brInt.left === null ||
            pointsEqual(brInt.left.intersection, bottomRight)
          ) {
            brInt.left = { intersection, inside: !onLineEnd };
          } else {
            // short or long based on inside or outside
            if (onLineEnd) {
              if (
                !brInt.left.inside &&
                brInt.left.intersection[0] > intersection[0]
              )
                brInt.left = { intersection, inside: !onLineEnd };
            } else {
              if (
                !brInt.left.inside ||
                brInt.left.intersection[0] < intersection[0]
              )
                brInt.left = { intersection, inside: !onLineEnd };
            }
          }
        }
        if (intersection[0] >= bottomRight[0]) {
          // right
          brInt.right = { intersection, inside: !onLineEnd };
        }
      }

      // HORIZONTALS
    } else {
      // top left
      if (between(topLeft[0], line[0][0], line[1][0], true)) {
        // intersection found
        let intersection = [topLeft[0], line[0][1]];
        let onLineEnd =
          intersection[0] == line[0][0] || intersection[0] == line[1][0];
        if (intersection[1] <= topLeft[1]) {
          // up
          tlInt.up = { intersection, inside: !onLineEnd };
        }
        if (intersection[1] > topLeft[1]) {
          // down
          if (
            tlInt.down === null ||
            pointsEqual(tlInt.down.intersection, topLeft)
          ) {
            tlInt.down = { intersection, inside: !onLineEnd };
          } else {
            // short or long based on inside or outside
            if (onLineEnd) {
              if (
                !tlInt.down.inside &&
                tlInt.down.intersection[1] < intersection[1]
              )
                tlInt.down = { intersection, inside: !onLineEnd };
            } else {
              if (
                !tlInt.down.inside ||
                tlInt.down.intersection[1] > intersection[1]
              ) {
                tlInt.down = { intersection, inside: !onLineEnd };
              }
            }
          }
        }
      }

      // bottom right
      if (between(bottomRight[0], line[0][0], line[1][0], true)) {
        // intersection found
        let intersection = [bottomRight[0], line[0][1]];
        let onLineEnd =
          intersection[0] == line[0][0] || intersection[0] == line[1][0];
        if (intersection[1] < bottomRight[1]) {
          // up
          if (
            brInt.up === null ||
            pointsEqual(brInt.up.intersection, bottomRight)
          ) {
            brInt.up = { intersection, inside: !onLineEnd };
          } else {
            // short or long based on inside or outside
            if (onLineEnd) {
              if (
                !brInt.up.inside &&
                brInt.up.intersection[1] > intersection[1]
              )
                brInt.up = { intersection, inside: !onLineEnd };
            } else {
              if (
                !brInt.up.inside ||
                brInt.up.intersection[1] < intersection[1]
              )
                brInt.up = { intersection, inside: !onLineEnd };
            }
          }
        }
        if (intersection[1] >= bottomRight[1]) {
          // down
          brInt.down = { intersection, inside: !onLineEnd };
        }
      }
    }
  }

  // console.log("tl");
  // console.log(tlInt);
  // console.log("br");
  // console.log(brInt);

  if (
    Object.values(tlInt).some((val) => val === null) ||
    Object.values(brInt).some((val) => val === null)
  ) {
    return false;
  }

  if (
    tlInt.right.intersection[0] < maxX ||
    tlInt.down.intersection[1] < maxY ||
    brInt.left.intersection[0] > minX ||
    brInt.up.intersection[1] > minY
  )
    return false;
  return true;
}

function getLineType(line) {
  if (line[0][1] == line[1][1]) return HORIZ;
  return VERT;
}

function between(val, a, b) {
  let start = Math.min(a, b);
  let end = Math.max(a, b);
  return val >= start && val <= end;
}

function pointsEqual(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
