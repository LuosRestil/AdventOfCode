function start() {
  hideCursor();
  clear();
}

function end() {
  process.stdout.write("\x1b[100;0H");
  showCursor();
}

function hideCursor() {
  process.stdout.write("\x1B[?25l");
}

function showCursor() {
  process.stdout.write("\x1B[?25h");
}

function clear() {
  process.stdout.write("\x1b[2J");
}

function writeChar(char, row, col) {
  process.stdout.write(`\x1b[${row + 1};${col + 1}H${char}`);
}

function printGrid(grid, paddingTop = 0) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      writeChar(grid[row][col], row + paddingTop, col);
    }
  }
}

function moveCursorToBeginning() {
  process.stdout.write("\x1b[0;0H");
}

function moveCursorBelowGrid(grid) {
  process.stdout.write(`\x1b[${grid.length + 1};1H`);
}

function moveCursor(row, col) {
  process.stdout.write(`\x1b[${row + 1};${col + 1}H`);
}

export default {
  start,
  end,
  printGrid,
  showCursor,
  writeChar,
  clear,
  moveCursor,
  moveCursorBelowGrid
};
