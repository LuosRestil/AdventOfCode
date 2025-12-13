import fs from 'fs';
const input = fs.readFileSync("inputs/day13.txt", { encoding: "utf-8" });
const lines = input.split("\n");
let total1 = 0;
let total2 = 0;
let pattern = [];
for (let line of lines) {
  if (!line.length) {
    const res = analyze(pattern);
    total1 += res.value;
    total2 += analyzeWithSmudge(pattern, res).value;
    pattern = [];
    continue;
  }
  pattern.push(line.split(""));
}
const res = analyze(pattern);
total1 += res.value;
total2 += analyzeWithSmudge(pattern, res).value;
console.log("Answer 1: " + total1);
console.log("Answer 2: " + total2);

function analyze(pattern, origRes = { type: null, index: null }) {
  // rows
  for (let i = 0; i < pattern.length - 1; i++) {
    if (origRes.type === "horizontal" && origRes.index === i) continue;
    if (
      rowToStr(pattern, i) === rowToStr(pattern, i + 1) &&
      isHorizontalMirror(pattern, i)
    ) {
      return {
        type: "horizontal",
        index: i,
        value: 100 * (i + 1),
      };
    }
  }
  // cols
  for (let i = 0; i < pattern[0].length - 1; i++) {
    if (origRes.type === "vertical" && origRes.index === i) continue;
    if (
      colToStr(pattern, i) === colToStr(pattern, i + 1) &&
      isVerticalMirror(pattern, i)
    ) {
      return {
        type: "vertical",
        index: i,
        value: i + 1,
      };
    }
  }
  return {
    type: null,
    index: null,
    value: 0,
  };
}

function analyzeWithSmudge(pattern, origRes) {
  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[0].length; j++) {
      const origChar = pattern[i][j];
      pattern[i][j] = origChar === "." ? "#" : ".";
      const res = analyze(pattern, origRes);
      if (res.type) return res;
      pattern[i][j] = origChar;
    }
  }
}

function isHorizontalMirror(pattern, topRow) {
  for (let i = topRow, j = topRow + 1; i >= 0 && j < pattern.length; i--, j++) {
    if (rowToStr(pattern, i) !== rowToStr(pattern, j)) return false;
  }
  return true;
}

function isVerticalMirror(pattern, leftCol) {
  for (
    let i = leftCol, j = leftCol + 1;
    i >= 0 && j < pattern[0].length;
    i--, j++
  ) {
    if (colToStr(pattern, i) !== colToStr(pattern, j)) return false;
  }
  return true;
}

function rowToStr(pattern, i) {
  return pattern[i].join("");
}

function colToStr(pattern, col) {
  let chars = [];
  for (let i = 0; i < pattern.length; i++) {
    chars.push(pattern[i][col]);
  }
  return chars.join("");
}
