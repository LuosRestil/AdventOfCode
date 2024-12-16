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
  clearTerminal();
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      writeChar(grid[row][col], row, col);
    }
  }
  moveCursorBelowGrid(grid);
}

function moveCursorBelowGrid(grid) {
  process.stdout.write(`\x1b[${grid.length+1};1H`)
}

module.exports = {
  hideCursor,
  showCursor,
  clearTerminal,
  writeChar,
  printGrid,
}