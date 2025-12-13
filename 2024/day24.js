import { getInput } from "../utils.js";

const input = getInput("day24edit.txt").split("\n\n");
const initVals = input[0]
  .split("\n")
  .map((line) => line.split(": "))
  .map((line) => {
    return { wire: line[0], val: Number(line[1]) };
  });
const gates = input[1]
  .split("\n")
  .map((line) => line.split(" -> "))
  .map((line) => {
    return { inputs: line[0].split(" "), output: line[1] };
  });

const wires = {};
for (let val of initVals) {
  wires[val.wire] = { val: val.val };
}
for (let gate of gates) {
  wires[gate.output] = {
    in1: gate.inputs[0],
    in2: gate.inputs[2],
    op: gate.inputs[1],
    val: null,
  };
}

let zs = [];
for (let gate of gates) {
  if (gate.output.startsWith("z")) {
    const idx = Number(gate.output.slice(1));
    zs[idx] = getVal(gate.output);
  }
  getVal(gate.output);
}
const zBin = zs.toReversed().join('');
console.log(`Part 1: ${parseInt(zBin, 2)}`);

const outs = gates.map(gate => gate.output);
const pairs = [];
for (let i = 0; i < outs.length - 1; i++) {
  for (let j = i + 1; j < outs.length; j++) {
    pairs.push([outs[i], outs[j]])
  }
}

const xs = [];
const ys = [];
for (let [k,v] of Object.entries(wires)) {
  if (k.startsWith('x')) {
    const idx = Number(k.slice(1));
    xs[idx] = v.val;
  } else if (k.startsWith('y')) {
    const idx = Number(k.slice(1));
    ys[idx] = v.val;
  }
}
const xBin = xs.toReversed().join('');
const yBin = ys.toReversed().join('');
const desired = (parseInt(xBin, 2) + parseInt(yBin, 2)).toString(2);
const actual = zBin;
console.log(`desired: ${desired}`);
console.log(`actual:  ${actual}`);

let swaps = ['gpr', 'z10', 'nks', 'z21', 'ghp', 'z33', 'krs', 'cpm'];
console.log(`Part 2: ${swaps.toSorted().join(',')}`)

function getVal(wireName) {
  const wire = wires[wireName];

  if (wire.val === null) {
    const in1Val = getVal(wire.in1);
    const in2Val = getVal(wire.in2);

    switch (wire.op) {
      case "AND":
        wire.val = in1Val & in2Val;
        break;
      case "OR":
        wire.val = in1Val | in2Val;
        break;
      case "XOR":
        wire.val = in1Val ^ in2Val;
        break;
    }
  }

  return wire.val;
}
