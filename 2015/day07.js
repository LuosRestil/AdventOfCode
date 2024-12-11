const fs = require('fs');

let input = fs.readFileSync('inputs/day07.txt', 'utf8');
input = input.split("\n");

let wires = {};

while (!wires['a']) {
  for (let line of input) {
    line = line.split(" -> ");
    let left = line[0];
    let right = line[1];
  
    if (wires[right]) {
      continue;
    }
  
    if (left.includes("AND")) {
      let operands = left.split(" AND ");
      let op1 = wires[operands[0]] !== undefined ? wires[operands[0]] : parseInt(operands[0]);
      let op2 = wires[operands[1]] !== undefined ? wires[operands[1]] : parseInt(operands[1]);
      if (Number.isInteger(op1) && Number.isInteger(op2)) {
        wires[right] = op1 & op2;
      }
    } else if (left.includes("OR")) {
      let operands = left.split(" OR ");
      let op1 = wires[operands[0]] !== undefined ? wires[operands[0]] : parseInt(operands[0]);
      let op2 = wires[operands[1]] !== undefined ? wires[operands[1]] : parseInt(operands[1]);
      if (Number.isInteger(op1) && Number.isInteger(op2)) {
        wires[right] = op1 | op2;
      }
    } else if (left.includes("LSHIFT")) {
      let operands = left.split(" LSHIFT ");
      let op1 = wires[operands[0]] !== undefined ? wires[operands[0]] : parseInt(operands[0]);
      let op2 = wires[operands[1]] !== undefined ? wires[operands[1]] : parseInt(operands[1]);
      let myVar = wires['s'];
      if (Number.isInteger(op1) && Number.isInteger(op2)) {
        wires[right] = op1 << op2;
      }
    } else if (left.includes("RSHIFT")) {
      let operands = left.split(" RSHIFT ");
      let op1 = wires[operands[0]] !== undefined ? wires[operands[0]] : parseInt(operands[0]);
      let op2 = wires[operands[1]] !== undefined ? wires[operands[1]] : parseInt(operands[1]);
      if (Number.isInteger(op1) && Number.isInteger(op2)) {
        wires[right] = op1 >> op2;
      }
    } else if (left.includes("NOT")) {
      let operand = left.slice(4, left.length);
      let op = wires[operand] !== undefined ? wires[operand] : parseInt(operand);
      if (Number.isInteger(op)) {
        wires[right] = ~op;
      }
    } else {
      let op = wires[left] !== undefined ? wires[left] : parseInt(left);
      if (Object.keys(wires).length > 335) {
        let myVar = op;
      }
      
      if (Number.isInteger(op)) {
        wires[right] = op;
      }
    }
  }
}

console.log(`Answer: ${wires['a']}`);
