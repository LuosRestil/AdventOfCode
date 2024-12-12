const { getInput } = require("../utils");

const instructions = getInput("day23.txt")
  .split("\n")
  .map((line) => {
    const parts = line.replace(",", "").split(" ");
    const instruction = parts[0];
    let register,
      amt = null;
    if (instruction === "jmp") amt = Number(parts[1]);
    else register = parts[1];
    if (parts.length === 3) amt = Number(parts[2]);
    return { instruction, register, amt };
  });

doTheThing(1);
doTheThing(2);

function doTheThing(part) {
  let idx = 0;
  const registers = { a: part - 1, b: 0 };
  while (idx >= 0 && idx < instructions.length) {
    const curr = instructions[idx];
    switch (curr.instruction) {
      case "hlf":
        registers[curr.register] /= 2;
        idx++;
        break;
      case "tpl":
        registers[curr.register] *= 3;
        idx++;
        break;
      case "inc":
        registers[curr.register]++;
        idx++;
        break;
      case "jmp":
        idx += curr.amt;
        break;
      case "jie":
        if (registers[curr.register] % 2 === 0) idx += curr.amt;
        else idx++;
        break;
      case "jio":
        if (registers[curr.register] === 1) idx += curr.amt;
        else idx++;
        break;
    }
  }
  console.log(`Part ${part}: ${registers.b}`);
}
