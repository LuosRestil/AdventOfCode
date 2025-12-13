import { getInput } from "../utils.js";

let groups = getInput("day06.txt").split("\n\n");

let p1 = groups
  .map((group) => new Set(group.split("\n").join("").split("")))
  .map((set) => set.size)
  .reduce((acc, curr) => acc + curr);
console.log(`Part 1: ${p1}`);

let p2 = groups
  .map((group) =>
    group
      .split("\n")
      .map((person) => new Set(person.split("")))
      .reduce((acc, curr) => acc.intersection(curr))
  )
  .map((set) => set.size)
  .reduce((acc, curr) => acc + curr);
console.log(`Part 2: ${p2}`);
