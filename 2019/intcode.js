export default class IntcodeComputer {
  constructor(program, inputs) {
    this.originalProgram = program; // original loaded program
    this.state = Array.from(this.originalProgram); // current modified program state
    this.ip = 0; // instruction pointer
    this.done = false;
    this.outputs = [];
    this.originalInputs = inputs ?? [];
    this.inputs = Array.from(this.originalInputs);
  }

  runProgram() {
    while (!this.tick()) {}
  }

  tick() {
    if (this.done) return this.done;

    let opcodeAndModes = this.state[this.ip++];
    let digits = [];
    while (opcodeAndModes > 0) {
      digits.push(opcodeAndModes % 10);
      opcodeAndModes = Math.floor(opcodeAndModes / 10);
    }
    let opcode = digits[0];
    if (digits.length > 1) opcode += digits[1] * 10;
    let paramModes = digits.slice(2);

    if (opcode === 1) {
      let operand1 = this.getOperand(paramModes[0]);
      let operand2 = this.getOperand(paramModes[1]);
      let destination = this.state[this.ip++];
      this.state[destination] = operand1 + operand2;
    } else if (opcode === 2) {
      let operand1 = this.getOperand(paramModes[0]);
      let operand2 = this.getOperand(paramModes[1]);
      let destination = this.state[this.ip++];
      this.state[destination] = operand1 * operand2;
    } else if (opcode === 3) {
      let destination = this.state[this.ip++];
      this.state[destination] = this.inputs.shift();
    } else if (opcode === 4) {
      let operand1 = this.getOperand(paramModes[0]);
      this.outputs.push(operand1);
    } 
    else if (opcode === 5) {
      let operand1 = this.getOperand(paramModes[0]);
      let operand2 = this.getOperand(paramModes[1]);
      if (operand1 !== 0) this.ip = operand2;
    }
    else if (opcode === 6) {
      let operand1 = this.getOperand(paramModes[0]);
      let operand2 = this.getOperand(paramModes[1]);
      if (operand1 === 0) this.ip = operand2;
    }
    else if (opcode === 7) {
      let operand1 = this.getOperand(paramModes[0]);
      let operand2 = this.getOperand(paramModes[1]);
      let destination = this.state[this.ip++];
      this.state[destination] = operand1 < operand2 ? 1 : 0;
    }
    else if (opcode === 8) {
      let operand1 = this.getOperand(paramModes[0]);
      let operand2 = this.getOperand(paramModes[1]);
      let destination = this.state[this.ip++];
      this.state[destination] = operand1 === operand2 ? 1 : 0;
    }
    else if (opcode === 99) {
      this.done = true;
    } else {
      throw new Error("invalid opcode " + opcode);
    }

    return this.done;
  }

  getOperand(mode) {
    return mode === 1
      ? this.state[this.ip++]
      : this.state[this.state[this.ip++]];
  }

  reset() {
    this.done = false;
    this.state = Array.from(this.originalProgram);
    this.ip = 0;
    this.inputs = Array.from(this.originalInputs);
    this.outputs = [];
  }
}
