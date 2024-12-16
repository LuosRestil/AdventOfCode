import utils from '../utils.js';
import viz from '../terminalViz.js';

process.on('SIGINT', () => {
  viz.end();
  process.exit();
})

console.time('time');

const [BOX, WALL, BOT, EMPTY] = ["O", "#", "@", "."];

const input = utils.getInput("day15sample.txt").split("\n\n");
const moves = input[1].replaceAll("\n", "");

let grid = input[0]
  .split("\n")
  .map((row) => row.split(""));

let botPos = utils.find2D(grid, BOT);

const dirMap = {
  "^": [-1, 0],
  v: [1, 0],
  "<": [0, -1],
  ">": [0, 1],
};

for (let move of moves) {
  const dir = dirMap[move];

  // scan for empty space or wall
  let loc = botPos;
  while (true) {
    const char = grid[loc[0]][loc[1]];
    if (char === WALL || char === EMPTY) break;
    loc = [loc[0] + dir[0], loc[1] + dir[1]];
  }

  // we didn't find an empty space before a wall, so we can't move
  if (grid[loc[0]][loc[1]] === WALL) continue;

  // move bot and boxes into empty space
  let nextLoc;
  while (true) {
    nextLoc = [loc[0] - dir[0], loc[1] - dir[1]];
    grid[loc[0]][loc[1]] = grid[nextLoc[0]][nextLoc[1]];
    if (nextLoc[0] === botPos[0] && nextLoc[1] === botPos[1]) break;
    loc = nextLoc;
  }

  grid[botPos[0]][botPos[1]] = EMPTY;
  botPos = loc;
}

let total = 0;
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[0].length; j++) {
    if (grid[i][j] === BOX) total += 100 * i + j;
  }
}

console.log(`Part 1: ${total}`);

grid = input[0]
  .split("\n")
  .map((row) =>
    row
      .replaceAll("#", "##")
      .replaceAll(".", "..")
      .replaceAll("O", "[]")
      .replaceAll("@", "@.")
  )
  .map(row => row.split(''));

botPos = utils.find2D(grid, BOT);

viz.start();
for (let move of moves) {
  viz.printGrid(grid, 1);
  viz.writeChar('next move: ' + move, 0, 0);
  if (move === "<" || move === ">") {
    const dir = dirMap[move];

    // same as we did in part 1
    // scan for empty space or wall
    let loc = botPos;
    while (true) {
      const char = grid[loc[0]][loc[1]];
      if (char === WALL || char === EMPTY) break;
      loc = [loc[0] + dir[0], loc[1] + dir[1]];
    }

    // we didn't find an empty space before a wall, so we can't move
    if (grid[loc[0]][loc[1]] === WALL) continue;

    // move bot and boxes into empty space
    let nextLoc;
    while (true) {
      nextLoc = [loc[0] - dir[0], loc[1] - dir[1]];
      grid[loc[0]][loc[1]] = grid[nextLoc[0]][nextLoc[1]];
      if (nextLoc[0] === botPos[0] && nextLoc[1] === botPos[1]) break;
      loc = nextLoc;
    }

    grid[botPos[0]][botPos[1]] = EMPTY;
    botPos = loc;
  } else {
    // special treatment for moving up and down, to handle wide boxes
    if (canMoveUpOrDown(botPos, move)) {
      moveUpOrDown(botPos, move);
      if (move === '^') botPos = [botPos[0] - 1, botPos[1]];
      else botPos = [botPos[0] + 1, botPos[1]];
    }
  }
  grid[botPos[0]][botPos[1]] = move;
  await utils.sleep(333);
}
viz.printGrid(grid);
viz.end();

total = 0;
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[0].length; j++) {
    if (grid[i][j] === '[') total += 100 * i + j;
  }
}

console.log(`Part 2: ${total}`);

console.timeEnd('time');


function canMoveUpOrDown(pos, move) {
  let rowOffset = 1;
  if (move === "^") rowOffset = -1;
  const char = grid[pos[0]][pos[1]];
  if (char === WALL) return false;
  if (char === EMPTY) return true;
  if ('^v<>'.includes(char)) return canMoveUpOrDown([pos[0] + rowOffset, pos[1]], move);
  if (char === "[" || char === "]") {
    const colOffset = char === "[" ? 1 : -1;
    return (
      canMoveUpOrDown([pos[0] + rowOffset, pos[1]], move) &&
      canMoveUpOrDown([pos[0] + rowOffset, pos[1] + colOffset], move)
    );
  }
}

// only called after canMoveUpOrDown, so we don't have to check for walls
function moveUpOrDown(pos, move) {
  let rowOffset = 1;
  if (move === "^") rowOffset = -1;
  const adjacentPos = [pos[0] + rowOffset, pos[1]];
  const adjacentChar = grid[adjacentPos[0]][adjacentPos[1]];
  if (adjacentChar !== EMPTY) {
    // move adjacent stone
    moveUpOrDown(adjacentPos, move);
    const colOffset = adjacentChar === "[" ? 1 : -1;
    moveUpOrDown([adjacentPos[0], adjacentPos[1] + colOffset], move);
  }
  // move self
  grid[adjacentPos[0]][adjacentPos[1]] = grid[pos[0]][pos[1]];
  grid[pos[0]][pos[1]] = EMPTY;
}
