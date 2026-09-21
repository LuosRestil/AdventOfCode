import fs from "fs";

console.time();

let pts = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", "day06.txt"), "utf-8")
  .split("\n")
  .map((row) => {
    return {
      pos: row.split(", ").map((num) => parseInt(num)),
      count: 0,
      infinite: false,
      color: [Math.random() * 255, Math.random() * 255, Math.random() * 255],
    };
  });

let minX = Math.min(...pts.map((pt) => pt.pos[0]));
let minY = Math.min(...pts.map((pt) => pt.pos[1]));
let maxX = Math.max(...pts.map((pt) => pt.pos[0]));
let maxY = Math.max(...pts.map((pt) => pt.pos[1]));

for (let x = minX; x <= maxX; x++) {
  for (let y = minY; y <= maxY; y++) {
    let nearestPt = null;
    let nearestDist = Infinity;
    for (let pt of pts) {
      let dist = manhattanDistance(x, y, pt.pos[0], pt.pos[1]);
      if (dist === nearestDist) {
        nearestPt = null;
      } else if (dist < nearestDist) {
        nearestDist = dist;
        nearestPt = pt;
      }
    }
    if (nearestPt) {
      nearestPt.count++;
      if (x === minX || y === minY || x === maxX || y === maxY) {
        nearestPt.infinite = true;
      }
    }
  }
}

console.log(
  `Part 1: ${pts.filter((pt) => !pt.infinite).toSorted((a, b) => b.count - a.count)[0].count}`,
);

/** PART 2 */
let limit = 10_000;
let midX = Math.floor((maxX - minX) / 2 + minX);
let midY = Math.floor((maxY - minY) / 2 + minY);
let [width, height] = [3, 3];
let area = 1;
let areaExpanded = true;
while (areaExpanded) {
  areaExpanded = false;
  let topY = midY - (height - 1) / 2;
  let bottomY = midY + (height - 1) / 2;
  let leftX = midX - (width - 1) / 2;
  let rightX = midX + (width - 1) / 2;
  for (let x = leftX; x <= rightX; x++) {
    let topDist = 0;
    let bottomDist = 0;
    for (let pt of pts) {
      topDist += manhattanDistance(x, topY, pt.pos[0], pt.pos[1]);
      bottomDist += manhattanDistance(x, bottomY, pt.pos[0], pt.pos[1]);
    }
    if (topDist < limit) {
      area++;
      areaExpanded = true;
    }
    if (bottomDist < limit) {
      area++;
      areaExpanded = true;
    }
  }
  for (let y = topY + 1; y <= bottomY - 1; y++) { // offset by 1 so you don't double count corners
    let leftDist = 0;
    let rightDist = 0;
    for (let pt of pts) {
      leftDist += manhattanDistance(leftX, y, pt.pos[0], pt.pos[1]);
      rightDist += manhattanDistance(rightX, y, pt.pos[0], pt.pos[1]);
    }
    if (leftDist < limit) {
      area++;
      areaExpanded = true;
    }
    if (rightDist < limit) {
      area++;
      areaExpanded = true;
    }
  }
  width += 2;
  height += 2;
}

console.log(`Part 2: ${area}`);

console.timeEnd();

function manhattanDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
