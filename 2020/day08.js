const { getInput } = require('../utils');

let input = getInput('day08.txt').split('\n');

let instructions = [];
let i = 0;
let acc = 0;
while (!instructions[i]) {
  instructions[i] = 1;
  let instruction = input[i].split(" ");
  let command = instruction[0];
  let value = parseInt(instruction[1]);
  if (command === "acc") {
    acc += value;
    i++;
  } else if (command === "jmp") {
    i += value;
  } else {
    i++;
  }
}
console.log(acc);

// ******************************************************************************

let lastAltered = -1;
let answerFound = false;
while (!answerFound) {
  inputCopy = input.slice();
  for (let j = lastAltered + 1; j < inputCopy.length; j++) {
    if (inputCopy[j].split(" ")[0] === "nop") {
      inputCopy[j] = "jmp " + inputCopy[j].split(" ")[1];
      lastAltered = j;
      break;
    } else if (inputCopy[j].split(" ")[0] === "jmp") {
      inputCopy[j] = "nop " + inputCopy[j].split(" ")[1];
      lastAltered = j;
      break;
    }
  }
  
  instructions = [];
  i = 0;
  acc = 0;
  while (true) {
    if (instructions[i]) {
      instructions = [];
      i = 0;
      acc = 0;
      break;
    }

    instructions[i] = 1;
    let instruction = inputCopy[i].split(" ");
    let command = instruction[0];
    let value = parseInt(instruction[1]);

    if (i === inputCopy.length - 1) {
      answerFound = true;
      if (command === "acc") {
        acc += value;
      }
      console.log(acc);
      break;
    }

    if (command === "acc") {
      acc += value;
      i++;
    } else if (command === "jmp") {
      i += value;
    } else {
      i++;
    }
  }
}
