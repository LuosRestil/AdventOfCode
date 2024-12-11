const fs = require('fs');
const input = fs.readFileSync('inputs/day03.txt', {encoding: 'utf-8'});
const grid = input.split('\n');

let total = 0;
let currNum = [];
let nums = [];
let startCol, endCol;
const nonSpecialChars = "0123456789.";
for (let row = 0; row < grid.length; row++) {
  if (currNum.length) {
    nums.push({
      row: row - 1,
      startCol,
      endCol,
      val: parseInt(currNum.join(''))
    });
    currNum = [];
  }
  for (let col = 0; col < grid[0].length; col++) {
    const char = grid[row][col];
    if (isDigit(char)) {
      if (!currNum.length) startCol = col;
      endCol = col;
      currNum.push(char);
    } else {
      if (currNum.length) {
        nums.push({
          row,
          startCol,
          endCol,
          val: parseInt(currNum.join(''))
        });
        currNum = [];
      }
    }
  }
}
for (let num of nums) {
  if (hasAdjacentSymbol(num)) total += num.val;
}
console.log('Answer 1: ' + total);

total = 0;
let stars = {};
for (let num of nums) {
  const adjacentStars = getAdjacentStars(num);
  for (let star of adjacentStars) {
    if (stars[star]) stars[star].push(num.val);
    else stars[star] = [num.val];
  } 
}
for (let nums of Object.values(stars)) {
  if (nums.length === 2) {
    total += nums[0] * nums[1];
  }
}
console.log('Answer 2: ' + total);


function isDigit(char) {
  return char >= "0" && char <= "9";
}

function hasAdjacentSymbol(num) {
  const fromCol = Math.max(0, num.startCol - 1);
  const toCol = Math.min(grid[0].length - 1, num.endCol + 1);
  // above num
  if (num.row > 0) {
    const row = num.row - 1;
    for (let col = fromCol; col <= toCol; col++) {
      const char = grid[row][col];
      if (!nonSpecialChars.includes(char)) {
        return true;
      }
    }
  }
  // beside num
  if (num.startCol > 0) {
    const char = grid[num.row][num.startCol - 1];
    if (!nonSpecialChars.includes(char)) {
      return true;
    }
  }
  if (num.endCol < grid[0].length - 1) {
    const char = grid[num.row][num.endCol + 1];
    if (!nonSpecialChars.includes(char)) {
      return true;
    }
  }
  // below num
  if (num.row < grid.length - 1) {
    const row = num.row + 1;
    for (let col = fromCol; col <= toCol; col++) {
      const char = grid[row][col];
      if (!nonSpecialChars.includes(char)) {
        return true;
      }
    }
  }
  return false;
}

function getAdjacentStars(num) {
  let adjacentStars = [];
  const fromCol = Math.max(0, num.startCol - 1);
  const toCol = Math.min(grid[0].length - 1, num.endCol + 1);
  // above num
  if (num.row > 0) {
    const row = num.row - 1;
    for (let col = fromCol; col <= toCol; col++) {
      const char = grid[row][col];
      if (char === "*") {
        adjacentStars.push(`${row}:${col}`);
      }
    }
  }
  // beside num
  if (num.startCol > 0) {
    const char = grid[num.row][num.startCol - 1];
    if (char === "*") {
      adjacentStars.push(`${num.row}:${num.startCol - 1}`);
    }
  }
  if (num.endCol < grid[0].length - 1) {
    const char = grid[num.row][num.endCol + 1];
    if (char === "*") {
      adjacentStars.push(`${num.row}:${num.endCol + 1}`);
    }
  }
  // below num
  if (num.row < grid.length - 1) {
    const row = num.row + 1;
    for (let col = fromCol; col <= toCol; col++) {
      const char = grid[row][col];
      if (char === "*") {
        adjacentStars.push(`${row}:${col}`);
      }
    }
  }
  return adjacentStars;
}