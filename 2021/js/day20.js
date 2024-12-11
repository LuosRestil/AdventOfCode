const { getInput } = require('../../utils');

const input = getInput('day20.txt').split('\n\n');
let algo = input[0];
let inputImage = input[1];

// Pt. 1
// let iterations = 2;
// Pt. 2
iterations = 50;

let padVal = '.';

image = inputImage.split("\n").map(row => row.split(""));

for (let i = 0; i < iterations; i++) {
  image = process(image, algo, padVal);
  padVal = padVal === '.' ? '#' : '.';
}

let totalLit = 0;
for (let row of image) {
  for (let char of row) {
    if (char === '#') {
      totalLit++;
    }
  }
}
console.log("Answer1: " + totalLit);

function process(inputImage, algo, padVal) {
  expandGrid(inputImage, 3, padVal);
  let outputImage = [];
  for (let i = 1; i < inputImage.length - 1; i++) {
    outputImage.push([]);
    for (let j = 1; j < inputImage[0].length - 1; j++) {
      let binStr = "";
      for (let k = -1; k <= 1; k++) {
        binStr += inputImage[i + k].slice(j - 1, j + 2).map(val => val === "#" ? 1 : 0).join("");
      }
      let binVal = parseInt(binStr, 2);
      outputImage[i - 1].push(algo[binVal]);
    }
  }
  return outputImage;
}

function expandGrid(grid, expansionFactor, padVal) {
  let rowLen = grid[0].length;
  for (let i = 0; i < expansionFactor; i++) {
    let newRowAbove = [];
    let newRowBelow = [];
    for (let j = 0; j < rowLen; j++) {
      newRowAbove.push(padVal);
      newRowBelow.push(padVal);
    }
    grid.unshift(newRowAbove);
    grid.push(newRowBelow);
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < expansionFactor; j++) {
      grid[i].unshift(padVal);
      grid[i].push(padVal);
    }
  }
}
