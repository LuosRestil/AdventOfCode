import fs from "fs";
import path from "node:path";

console.time();

let input = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", "day16.txt"), "utf-8")
  .split("\n\n");
let samples = input.slice(0, -2).map((sample) => {
  let rows = sample.split("\n");
  let before = rows[0]
    .match(/\[(.+)\]/)[1]
    .split(", ")
    .map((digit) => parseInt(digit));
  let instruction = rows[1].split(" ").map((digit) => parseInt(digit));
  let after = rows[2]
    .match(/\[(.+)\]/)[1]
    .split(", ")
    .map((digit) => parseInt(digit));
  return { instruction, before, after };
});
let program = input
  .at(-1)
  .split("\n")
  .map((row) => row.split(" ").map((digit) => parseInt(digit)));

let operations = {
  addr: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] =
        registers[instruction[1]] + registers[instruction[2]]),
  },
  addi: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] = registers[instruction[1]] + instruction[2]),
  },
  mulr: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] =
        registers[instruction[1]] * registers[instruction[2]]),
  },
  muli: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] = registers[instruction[1]] * instruction[2]),
  },
  banr: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] =
        registers[instruction[1]] & registers[instruction[2]]),
  },
  bani: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] = registers[instruction[1]] & instruction[2]),
  },
  borr: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] =
        registers[instruction[1]] | registers[instruction[2]]),
  },
  bori: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] = registers[instruction[1]] | instruction[2]),
  },

  setr: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] = registers[instruction[1]]),
  },
  seti: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] = instruction[1]),
  },

  gtir: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] =
        instruction[1] > registers[instruction[2]] ? 1 : 0),
  },
  gtri: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] =
        registers[instruction[1]] > instruction[2] ? 1 : 0),
  },
  gtrr: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] =
        registers[instruction[1]] > registers[instruction[2]] ? 1 : 0),
  },
  eqir: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] =
        instruction[1] === registers[instruction[2]] ? 1 : 0),
  },
  eqri: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] =
        registers[instruction[1]] === instruction[2] ? 1 : 0),
  },
  eqrr: {
    possibleNumbers: new Set(),
    finalNumber: null,
    func: (registers, instruction) =>
      (registers[instruction[3]] =
        registers[instruction[1]] === registers[instruction[2]] ? 1 : 0),
  },
};

let qualifying = 0;
for (let sample of samples) {
  let matches = 0;
  for (let opName in operations) {
    let operation = operations[opName];
    let registers = [...sample.before];
    operation.func(registers, sample.instruction);
    if (arrayEquals(registers, sample.after)) {
      matches++;
      operation.possibleNumbers.add(sample.instruction[0]);
    }
  }
  if (matches >= 3) {
    qualifying++;
  }
}
console.log(`Part 1: ${qualifying}`);

let satisfied = 0;
while (satisfied < Object.keys(operations).length) {
  for (let opName in operations) {
    let operation = operations[opName];
    if (operation.finalNumber !== null) continue;
    if (operation.possibleNumbers.size === 1) {
      operation.finalNumber = [...operation.possibleNumbers][0];
      satisfied++;
      for (let otherName in operations) {
        let otherOp = operations[otherName];
        otherOp.possibleNumbers.delete(operation.finalNumber);
      }
    }
  }
}
let ops = {};
for (let opName in operations) {
  let operation = operations[opName];
  ops[operation.finalNumber] = operation.func;
}

let registers = [0, 0, 0, 0];
for (let instruction of program) {
  ops[instruction[0]](registers, instruction);
}
console.log(`Part 2: ${registers[0]}`);

console.timeEnd();

function arrayEquals(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
