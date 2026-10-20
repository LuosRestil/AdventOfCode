let points = [
  { x: 0.1, y: -1 }, // up
  { x: 1, y: 0 }, // right
  { x: 0, y: 1 }, // down
  { x: -1, y: 0 }, // left
];

let angles = points.map((point) => {
  let angle = Math.atan2(point.x - 0.1, -(point.y - 0.1));
  if (angle < 0) {
    angle += 2 * Math.PI;
  }
  return angle;
});

console.log(angles);
