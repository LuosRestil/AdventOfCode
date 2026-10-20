export default class IntcodeComputer {
  static STATUS_READY = 0;
  static STATUS_RUNNING = 1;
  static STATUS_AWAITING_INPUT = 2;
  static STATUS_DONE = 3;

  constructor(program, inputs) {
    this.status = IntcodeComputer.STATUS_READY;
    this.originalProgram = program; // original loaded program
    this.state = Array.from(this.originalProgram); // current modified program state
    this.ip = 0; // instruction pointer
    this.outputs = [];
    this.originalInputs = inputs ?? [];
    this.inputs = Array.from(this.originalInputs);
  }

  runProgram() {
    this.status = IntcodeComputer.STATUS_RUNNING;
    while (this.status === IntcodeComputer.STATUS_RUNNING) {
      this.tick();
    }
  }

  tick() {
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
      if (!this.inputs.length) {
        this.status = IntcodeComputer.STATUS_AWAITING_INPUT;
        this.ip--;
        return;
      }
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
      this.status = IntcodeComputer.STATUS_DONE;
    } else {
      throw new Error("invalid opcode " + opcode);
    }
  }

  getOperand(mode) {
    return mode === 1
      ? this.state[this.ip++]
      : this.state[this.state[this.ip++]];
  }

  reset() {
    this.status = IntcodeComputer.STATUS_READY;
    this.state = Array.from(this.originalProgram);
    this.ip = 0;
    this.inputs = Array.from(this.originalInputs);
    this.outputs = [];
  }
}
