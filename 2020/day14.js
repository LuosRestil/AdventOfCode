import { getInput } from '../utils.js';

let input = getInput('day14.txt').split('\n');

let mask = "";
let mem = {};

for (let line of input) {
  line = line.split(" = ");
  if (line[0] === "mask") {
    mask = line[1];
  } else {
    let key = line[0].slice(4, line[0].length - 1);
    let val = binaryToInt(applyMask1(mask, intToBinary(parseInt(line[1]))));
    mem[key] = val;
  }
}

console.log(`Answer: ${Object.values(mem).reduce((acc, curr) => acc + curr)}`);

// ****************************************************************************************

mask = "";
mem = {};

for (let line of input) {
  line = line.split(" = ");
  if (line[0] === "mask") {
    mask = line[1];
  } else {
    let addressToMask = line[0].slice(4, line[0].length - 1);
    let addressToMaskBinary = intToBinary(parseInt(addressToMask));
    let addresses = applyMask2(mask, addressToMaskBinary);
    for (let address of addresses) {
      let key = binaryToInt(address);
      mem[key] = parseInt(line[1]);
    }
  }
}

console.log(`Answer: ${Object.values(mem).reduce((acc, curr) => acc + curr)}`);

// ------------------------------------------------------------

function intToBinary(num) {
  num = num.toString(2);
  while (num.length < 36) {
    num = "0" + num;
  }
  return num;
}

function binaryToInt(binaryString) {
  return parseInt(binaryString, 2);
}

// returns new binary number
function applyMask1(mask, num) {
  mask = mask.split("");
  num = num.split("");
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] !== "X" && mask[i] !== num[i]) {
      num[i] = mask[i];
    }
  }
  return num.join("");
}

// returns array of binary numbers
function applyMask2(mask, num) {
  mask = mask.split("");
  num = num.split("");
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] !== "0") {
      num[i] = mask[i];
    }
  }
  let floating = 0;
  for (let char of num) {
    if (char === "X") {
      floating++;
    }
  }
  let binaries = getBinaryPossibilities(floating);

  let possibilities = [];

  for (let binary of binaries) {
    let binaryIndex = 0;
    let numCopy = [...num];
    for (let i = 0; i < numCopy.length; i++) {
      if (numCopy[i] === "X") {
        numCopy[i] = binary[binaryIndex];
        binaryIndex++;
      }
    }
    possibilities.push(numCopy.join(""));
  }
  return possibilities;
}

function getBinaryPossibilities(digits) {
  if (digits === 1) {
    return [["0"], ["1"]];
  }
  let possibilities = [];
  for (let possibility of getBinaryPossibilities(digits - 1)) {
    possibilities.push(["0"].concat(possibility).join(""));
    possibilities.push(["1"].concat(possibility).join(""));
  }
  return possibilities;
}
