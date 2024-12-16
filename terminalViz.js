function start() {
  hideCursor();
  clearTerminal();
}

function end(grid) {
  moveCursorBelowGrid(grid);
  showCursor();
}

function hideCursor() {
  process.stdout.write('\x1B[?25l'); 
}

function showCursor() {
  process.stdout.write('\x1B[?25h');
}

function clearTerminal() {
  process.stdout.write("\x1b[2J");
}

function writeChar(char, row, col) {
  process.stdout.write(`\x1b[${row+1};${col+1}H${char}`);
}

function printGrid(grid) {
  moveCursorToBeginning();
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      writeChar(grid[row][col], row, col);
    }
  }
}

function moveCursorToBeginning() {
  process.stdout.write("\x1b[0;0H");
}

function moveCursorBelowGrid(grid) {
  process.stdout.write(`\x1b[${grid ? grid.length+1 : 100};1H`)
}

export default {
  start,
  end,
  printGrid,
  showCursor,
  writeChar,
}