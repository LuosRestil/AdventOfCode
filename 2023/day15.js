const fs = require('fs');
const input = fs.readFileSync('inputs/day15.txt', {encoding: 'utf-8'});
const steps = input.split(',');

let total = 0;
for (let step of steps) {
  total += hash(step);
}
console.log('Answer 1: ' + total);

const labelHashes = new Map();
let boxes = [];
for (let i = 0; i < 256; i++) {
  boxes.push(new Map());
}
for (let step of steps) {
  let opCode = "-";
  const opCodeIdx = step.indexOf("=");
  if (opCodeIdx > -1) {
    opCode = "=";
  }
  const label = step.slice(0, step.length - (opCode === "-" ? 1 : 2));
  if (!labelHashes.has(label)) labelHashes.set(label, hash(label));
  const boxNumber = labelHashes.get(label);
  if (opCode === "-") {
    removeLens(label, boxNumber);
  } else if (opCode === "=") {
    const focalLength = parseInt(step[step.length - 1]);
    const lens = {focalLength, label, slot: -1};
    addLens(lens, boxNumber);
  } else {
    throw new Error("oh god oh fuck");
  }
}
total = 0;
for (let i = 0; i < boxes.length; i++) {
  boxes[i].forEach((lens) => total += getLensFocusingPower(lens, i));
}
console.log('Answer 2: ' + total);


function hash(str) {
  let curr = 0;
  for (let char of str) {
    const ascii = char.charCodeAt(0);
    curr += ascii;
    curr *= 17;
    curr %= 256;
  }
  return curr;
}

function getLensFocusingPower(lens, boxNumber) {
  let fp = 1 + boxNumber;
  fp *= lens.slot;
  fp *= lens.focalLength;
  return fp;
}

function removeLens(label, boxNumber) {
  const box = boxes[boxNumber];
  if (box.has(label)) {
    const removedLens = box.get(label);
    box.delete(label);
    box.forEach(lens => {
      if (lens.slot > removedLens.slot) lens.slot -= 1;
    });
  }
}

function addLens(lens, boxNumber) {
  const box = boxes[boxNumber];
  if (box.has(lens.label)) {
    const existingLens = box.get(lens.label);
    lens.slot = existingLens.slot;
    box.delete(existingLens.label);
    box.set(lens.label, lens);
  } else {
    lens.slot = box.size + 1;
    box.set(lens.label, lens);
  }
}