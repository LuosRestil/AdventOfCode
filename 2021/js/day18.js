import { getInput } from "../../utils.js";

let input = getInput('day18.txt');
input = input.split('\n');
let snailNumTotal = input.reduce((acc, curr) => reduceSnailfishNum(addSnailfishNums(acc, curr)));
console.log("Answer1: " + getMagnitude(JSON.parse(snailNumTotal)));

let maxMag = 0;
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input.length; j++) {
    if (i !== j) {
      let mag = getMagnitude(JSON.parse(reduceSnailfishNum(addSnailfishNums(input[i], input[j]))));
      if (mag > maxMag) {
        maxMag = mag;
      }
    }
  }
}
console.log("Answer2: " + maxMag);

function addSnailfishNums(sn1, sn2) {
  return `[${sn1},${sn2}]`;
}

function reduceSnailfishNum(sn) {
  let complete = false;
  while (!complete) {
    let depth = 0;
    let hasExploded = false;
    let bracketStack = [];
    for (let i = 0; i < sn.length; i++) {
      if (sn[i] === "[") {
        depth++;
        bracketStack.push(["[", i]);
      } else if (sn[i] === "]") {
        // explode
        if (depth > 4 && bracketStack[bracketStack.length - 1][0] === "[") {
          hasExploded = true;
          let pairIndex = bracketStack[bracketStack.length - 1][1];
          let pairEndIndex = i;
          let pair = JSON.parse(sn.slice(pairIndex, pairEndIndex + 1));
          // replace pair with 0
          sn = sn.slice(0, pairIndex) + "0" + sn.slice(pairEndIndex + 1, sn.length);
          // add to right
          for (let j = pairIndex + 1; j < sn.length; j++) {
            if (!isNaN(sn[j])) {
              let numStartIndex = j;
              let numEndIndex = j;
              // found num, find end
              while(!isNaN(sn[numEndIndex + 1])) {
                numEndIndex++;
              }
              let num = parseInt(sn.slice(numStartIndex, numEndIndex + 1));
              sn = sn.slice(0, numStartIndex) + (num + pair[1]) + sn.slice(numEndIndex + 1, sn.length);
              break;
            }
          }
          // add to left
          for (let j = pairIndex - 1; j >= 0; j--) {
            if (!isNaN(sn[j])) {
              let numStartIndex = j;
              let numEndIndex = j;
              // found num, find start
              while (!isNaN(sn[numStartIndex - 1])) {
                numStartIndex--;
              }
              let num = parseInt(sn.slice(numStartIndex, numEndIndex + 1));
              sn = sn.slice(0, numStartIndex) + (num + pair[0]) + sn.slice(numEndIndex + 1, sn.length);
              break;
            }
          }
          break;
        }
        bracketStack.push(["]", i])
        depth--;
      }
    }
    
    let hasSplit = false;
    if (!hasExploded) {
      // check for splits
      for (let i = 0; i < sn.length; i++) {
        if (!isNaN(sn[i])) {
          let numStartIndex = i;
          let numEndIndex = i;
          while (!isNaN(sn[numEndIndex + 1])) {
            numEndIndex++;
          }
          if (numEndIndex > numStartIndex) {
            hasSplit = true;
            let num = parseInt(sn.slice(numStartIndex, numEndIndex + 1));
            sn = `${sn.slice(0, numStartIndex)}[${Math.floor(num / 2)},${Math.ceil(num / 2)}]${sn.slice(numEndIndex + 1, sn.length)}`;
            break;
          }
        }
      }
    }
    
    if (!hasExploded && !hasSplit) {
      complete = true;
    }
  }
  
  return sn;
}

function getMagnitude(sn) {
  let left;
  let right;
  if (!isNaN(sn[0])) {
    left = sn[0];
  } else {
    left = getMagnitude(sn[0]);
  }

  if (!isNaN(sn[1])) {
    right = sn[1];
  } else {
    right = getMagnitude(sn[1]);
  }

  return (3 * left) + (2 * right);
}
