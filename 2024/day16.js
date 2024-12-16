import utils from "../utils.js";
import viz from "../terminalViz.js";

const doViz = process.argv[2] === "viz";

// const dirs = ['n', 'e', 's', 'w'];
const posOffsets = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const maze = utils
  .getInput("day16.txt")
  .split("\n")
  .map((row, rowIdx) =>
    row.split("").map((col, colIdx) => {
      return {
        val: col,
        cost: Infinity,
        dir: null,
        from: null,
        pos: [rowIdx, colIdx],
      };
    })
  );

let startPos;
let endPos;
for (let i = 0; i < maze.length; i++) {
  for (let j = 0; j < maze[0].length; j++) {
    const char = maze[i][j].val;
    if (char === "S") startPos = [i, j];
    else if (char === "E") endPos = [i, j];
  }
}

const startCell = utils.gridGetPos(maze, startPos);
startCell.cost = 0;
startCell.dir = 1;

const queue = [];
queue.push(startPos);
while (queue.length) {
  const pos = queue.shift();
  const cell = utils.gridGetPos(maze, pos);
  if (cell.val === "E") {
    continue;
  }
  // look in dir
  const forward = [
    pos[0] + posOffsets[cell.dir][0],
    pos[1] + posOffsets[cell.dir][1],
  ];
  const forwardCell = utils.gridGetPos(maze, forward);
  if (forwardCell.val !== "#" && forwardCell.cost > cell.cost + 1) {
    forwardCell.cost = cell.cost + 1;
    forwardCell.dir = cell.dir;
    forwardCell.from = cell; // just in case we want to visualize the path
    queue.push(forward);
  }
  // look left
  const leftDir = utils.getPrevIdx(posOffsets, cell.dir);
  const left = [
    pos[0] + posOffsets[leftDir][0],
    pos[1] + posOffsets[leftDir][1],
  ];
  const leftCell = utils.gridGetPos(maze, left);
  if (leftCell.val !== "#" && leftCell.cost > cell.cost + 1001) {
    leftCell.cost = cell.cost + 1001;
    leftCell.dir = leftDir;
    leftCell.from = cell; // just in case we want to visualize the path
    queue.push(left);
  }
  // look right
  const rightDir = utils.getNextIdx(posOffsets, cell.dir);
  const right = [
    pos[0] + posOffsets[rightDir][0],
    pos[1] + posOffsets[rightDir][1],
  ];
  const rightCell = utils.gridGetPos(maze, right);
  if (rightCell.val !== "#" && rightCell.cost > cell.cost + 1001) {
    rightCell.cost = cell.cost + 1001;
    rightCell.dir = rightDir;
    rightCell.from = cell; // just in case we want to visualize the path
    queue.push(right);
  }
}

console.log(`Part 1: ${maze[endPos[0]][endPos[1]].cost}`);

function printMaze() {
  const dirSymbols = ["^", ">", "v", "<"];
  let curr = maze[endPos[0]][endPos[1]];
  while (curr) {
    curr.val = dirSymbols[curr.dir];
    curr = curr.from;
  }
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze.length; j++) {
      process.stdout.write(maze[i][j].val);
    }
    process.stdout.write("\n");
  }
}
