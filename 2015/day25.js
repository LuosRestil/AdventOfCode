console.time("time");

const [targetRow, targetCol] = [2947, 3029];
const startVal = 20151125;
const cycleLength = findCycleLength();
let targetIdx = rowColToIdx(targetRow, targetCol);
while (targetIdx > cycleLength) {
  targetIdx -= cycleLength;
}
let curr = startVal;
for (let i = 0; i < targetIdx; i++) {
  curr = getNext(curr);
}
console.log(`Part 1: ${curr}`);


function findCycleLength() {
  let length = 1;
  let curr = startVal;
  let start = true;
  while (true) {
    if (curr === startVal && !start) 
      return length;
    start = false;
    curr = getNext(curr);
    length++;
  }
}

function getNext(num) {
  return (num * 252533) % 33554393;
}

function getRowStart(row) {
  let val = 1;
  for (let i = 0; i < row; i++) {
    val += i;
  }
  return val;
}


function rowColToIdx(row, col) {
  let idx = getRowStart(row);
  for (let i = 1; i < col; i++) {
    idx += row + i;
  }
  return idx;
}

console.timeEnd("time");
