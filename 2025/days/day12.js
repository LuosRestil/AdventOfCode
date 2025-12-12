const fs = require("fs");

let sections = fs.readFileSync("inputs/day12.txt", "utf-8").split("\n\n");

let presents = sections
  .slice(0, sections.length - 1)
  .map((section) => section.split("\n").slice(1).join("/"));
let presentSizes = presents.map(
  (present) => present.split("").filter((c) => c === "#").length
);
let regions = sections
  .at(-1)
  .split("\n")
  .map((line) => {
    let sp = line.split(": ");
    let dim = sp[0].split("x").map((num) => parseInt(num));
    let requirements = sp[1].split(" ").map((num) => parseInt(num));
    return { dim, requirements };
  });

let valid = 0;
for (let region of regions) {
  let area = region.dim[0] * region.dim[1];
  let required = region.requirements
    .map((amt, idx) => amt * presentSizes[idx])
    .reduce((acc, curr) => acc + curr);
  if (area - required > 0) valid++;
}
console.log(`Part 1: ${valid}`);
