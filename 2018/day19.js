import fs from "fs";
import path from "node:path";

console.time();

let input = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", "day19.txt"), "utf-8")
  .split("\n");
let ipRegister = parseInt(input[0].split(" ")[1]);
let program = input.slice(1).map((row, idx) => {
  let split = row.split(" ");
  return {
    op: split[0],
    inputs: [0, ...split.slice(1).map((digit) => parseInt(digit))],
    idx,
  };
});

let operations = {
  addr: (registers, instruction) =>
    (registers[instruction[3]] =
      registers[instruction[1]] + registers[instruction[2]]),
  addi: (registers, instruction) =>
    (registers[instruction[3]] = registers[instruction[1]] + instruction[2]),
  mulr: (registers, instruction) =>
    (registers[instruction[3]] =
      registers[instruction[1]] * registers[instruction[2]]),
  muli: (registers, instruction) =>
    (registers[instruction[3]] = registers[instruction[1]] * instruction[2]),
  banr: (registers, instruction) =>
    (registers[instruction[3]] =
      registers[instruction[1]] & registers[instruction[2]]),
  bani: (registers, instruction) =>
    (registers[instruction[3]] = registers[instruction[1]] & instruction[2]),
  borr: (registers, instruction) =>
    (registers[instruction[3]] =
      registers[instruction[1]] | registers[instruction[2]]),
  bori: (registers, instruction) =>
    (registers[instruction[3]] = registers[instruction[1]] | instruction[2]),
  setr: (registers, instruction) =>
    (registers[instruction[3]] = registers[instruction[1]]),
  seti: (registers, instruction) =>
    (registers[instruction[3]] = instruction[1]),
  gtir: (registers, instruction) =>
    (registers[instruction[3]] =
      instruction[1] > registers[instruction[2]] ? 1 : 0),
  gtri: (registers, instruction) =>
    (registers[instruction[3]] =
      registers[instruction[1]] > instruction[2] ? 1 : 0),
  gtrr: (registers, instruction) =>
    (registers[instruction[3]] =
      registers[instruction[1]] > registers[instruction[2]] ? 1 : 0),
  eqir: (registers, instruction) =>
    (registers[instruction[3]] =
      instruction[1] === registers[instruction[2]] ? 1 : 0),
  eqri: (registers, instruction) =>
    (registers[instruction[3]] =
      registers[instruction[1]] === instruction[2] ? 1 : 0),
  eqrr: (registers, instruction) =>
    (registers[instruction[3]] =
      registers[instruction[1]] === registers[instruction[2]] ? 1 : 0),
};

let ip = 0;
let registers = [0, 0, 0, 0, 0, 0];
while (true) {
  registers[ipRegister] = ip;
  if (ip < 0 || ip >= program.length) break;
  let instruction = program[ip];
  operations[instruction.op](registers, instruction.inputs);
  ip = registers[ipRegister];
  ip++;
}

console.log(`Part 1: ${registers[0]}`);

// reg2 continually counts from 1 to 10551339
// every time it hits 10551339, reg3 increments
// when reg3 * reg2 == reg5, inc reg0 by reg3
// when reg3 > reg5, break
// this means we just need factors of 10551339
let total = 0;
for (let i = 1; i <= Math.sqrt(10551339); i++) {
  if (10551339 % i === 0) {
    total += i + 10551339 / i;
  }
}
console.log(`Part 2: ${total}`);

console.timeEnd();
