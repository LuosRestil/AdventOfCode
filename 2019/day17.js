import fs from "fs";
import path from "node:path";
import IntcodeComputer from "./intcode.js";
import { getNextIdx, getPrevIdx } from "../utils.js";

console.time();

const filename = "day17.txt";

let program = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split(",")
  .map((num) => parseInt(num));

let dirs = [
  { char: "^", vec: { x: 0, y: -1 } },
  { char: ">", vec: { x: 1, y: 0 } },
  { char: "v", vec: { x: 0, y: 1 } },
  { char: "<", vec: { x: -1, y: 0 } },
];

let computer = new IntcodeComputer(program, []);
computer.run();
let outputs = computer.outputs;

let i = 0;
while (outputs[i] !== 10) {
  i++;
}
const gridW = i;
const gridH = Math.floor(outputs.length / gridW);
let grid = Array(gridH)
  .fill(null)
  .map(() => Array(gridW).fill(null));
let botPos = null;
let botDir = null;
let botChars = ["^", "v", "<", ">"];
let [x, y] = [0, 0];
for (let output of outputs.slice(0, outputs.length - 1)) {
  if (output === 10) {
    y++;
    x = 0;
  } else {
    const char = String.fromCharCode(output);
    grid[y][x] = char;
    if (botChars.includes(char)) {
      botPos = { y, x };
      if (char === "^") botDir = 0;
      else if (char === ">") botDir = 1;
      else if (char === "v") botDir = 2;
      else if (char === "<") botDir = 3;
      else {
        throw new Error("unknown character " + character);
      }
    }
    x++;
  }
}

let total = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[y][x] !== "#") continue;
    let neighbors = [
      { x: x + 1, y: y },
      { x: x - 1, y: y },
      { x: x, y: y + 1 },
      { x: x, y: y - 1 },
    ];
    if (neighbors.every((neighbor) => grid[neighbor.y]?.[neighbor.x] === "#")) {
      total += x * y;
    }
  }
}
console.log(`Part 1: ${total}`);

let turn = null;
let dist = 0;
let moves = [];
let target = { x: 0, y: grid.length - 1 };
while (botPos.x !== target.x || botPos.y !== target.y) {
  let next = {
    x: botPos.x + dirs[botDir].vec.x,
    y: botPos.y + dirs[botDir].vec.y,
  };
  if (grid[next.y]?.[next.x] === "#") {
    dist++;
    botPos = next;
  } else {
    if (turn) {
      moves.push(turn + dist);
    }
    let rightDir = getNextIdx(dirs, botDir);
    let right = {
      x: botPos.x + dirs[rightDir].vec.x,
      y: botPos.y + dirs[rightDir].vec.y,
    };
    if (grid[right.y]?.[right.x] === "#") {
      turn = "R";
      dist = 1;
      botDir = rightDir;
      botPos = right;
      continue;
    }

    let leftDir = getPrevIdx(dirs, botDir);
    let left = {
      x: botPos.x + dirs[leftDir].vec.x,
      y: botPos.y + dirs[leftDir].vec.y,
    };
    if (grid[left.y]?.[left.x] === "#") {
      turn = "L";
      dist = 1;
      botDir = leftDir;
      botPos = left;
    }
  }
}
moves.push(turn + dist);

let patternsMap = {};
for (let i = 5; i > 1; i--) {
  for (let j = 0; j <= moves.length - i; j++) {
    let pattern = moves.slice(j, j + i).join(",");
    if (!patternsMap[pattern]) patternsMap[pattern] = { spans: {}, length: i };
    patternsMap[pattern].spans[j] = j + i - 1;
  }
}
let patterns = Object.entries(patternsMap);

let candidates = [];
for (let i = 0; i < patterns.length - 2; i++) {
  for (let j = i + 1; j < patterns.length - 1; j++) {
    for (let k = j + 1; k < patterns.length; k++) {
      candidates.push([patterns[i], patterns[j], patterns[k]]);
    }
  }
}

let pathInfo = null;
let paths = candidates
  .map((candidate) => getPath(candidate))
  .filter((path) => path);
if (paths.length) {
  let node = paths[0].node;
  // console.log(paths[0].candidate);
  let finalPath = [];
  let printableFinalPath = [];
  while (node.from) {
    finalPath.push(65 + node.pattern);
    finalPath.push(44);
    printableFinalPath.push(paths[0].candidate[node.pattern]);
    node = node.from;
  }
  // console.log(printableFinalPath);
  finalPath = finalPath.toReversed().slice(1);
  finalPath.push(10);
  // console.log(finalPath);
  pathInfo = {
    patterns: paths[0].candidate.map((pattern) => {
      let encoded = pattern
        .split(",")
        .map((step) => {
          return [
            step[0].charCodeAt(0),
            44,
            ...step
              .slice(1)
              .split("")
              .map((digit) => digit.charCodeAt(0)),
            44,
          ];
        })
        .flat();
      encoded[encoded.length - 1] = 10;
      return encoded;
    }),
    finalPath,
  };
} else {
  throw new Error("no path found");
}

program[0] = 2;
computer = new IntcodeComputer(program, [
  ...pathInfo.finalPath,
  ...pathInfo.patterns[0],
  ...pathInfo.patterns[1],
  ...pathInfo.patterns[2],
  110, // 121 to "see a continuous video feed", 110 to not
  10,
]);
while (computer.state !== IntcodeComputer.STATUS_DONE) {
  try {
    computer.run();
  } catch (err) {
    // computer hits opcode 0 (invalid) at the end instead of exiting
    break;
  }
}
console.log(`Part 2: ${computer.outputs.pop()}`);

function getPath(candidate) {
  let queue = [{ from: null, target: 0 }];
  while (queue.length) {
    let curr = queue.pop();
    if (curr.target === moves.length) {
      return {
        candidate: candidate.map((pattern) => pattern[0]),
        node: curr,
      };
    }
    for (let i = 0; i < candidate.length; i++) {
      if (candidate[i][1].spans[curr.target]) {
        let toPush = {
          from: curr,
          target: candidate[i][1].spans[curr.target] + 1,
          pattern: i,
        };
        queue.push(toPush);
      }
    }
  }
  return null;
}

function printGrid(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      let char = grid[y][x];
      if (y === botPos.y && x === botPos.x)
        process.stdout.write(dirs[botDir].char);
      else process.stdout.write(char);
    }
    process.stdout.write("\n");
  }
}
