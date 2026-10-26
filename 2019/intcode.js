export default class IntcodeComputer {
  static STATUS_READY = 0;
  static STATUS_RUNNING = 1;
  static STATUS_AWAITING_INPUT = 2;
  static STATUS_DONE = 3;

  constructor(program, inputs) {
    this.status = IntcodeComputer.STATUS_READY;
    this.originalProgram = program; // original loaded program
    this.state = this.setState(this.originalProgram); // current modified program state
    this.ip = 0; // instruction pointer
    this.outputs = [];
    this.originalInputs = inputs ?? [];
    this.inputs = Array.from(this.originalInputs);
    this.relativeBase = 0;
  }

  run() {
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
      let destination = this.getDestination(paramModes[2]);
      this.state[destination] = operand1 + operand2;
    } else if (opcode === 2) {
      let operand1 = this.getOperand(paramModes[0]);
      let operand2 = this.getOperand(paramModes[1]);
      let destination = this.getDestination(paramModes[2]);
      this.state[destination] = operand1 * operand2;
    } else if (opcode === 3) {
      if (!this.inputs.length) {
        this.status = IntcodeComputer.STATUS_AWAITING_INPUT;
        this.ip--;
        return;
      }
      let destination = this.getDestination(paramModes[0]);
      let input = this.inputs.shift();
      this.state[destination] = input;
    } else if (opcode === 4) {
      let operand1 = this.getOperand(paramModes[0]);
      this.outputs.push(operand1);
    } else if (opcode === 5) {
      let operand1 = this.getOperand(paramModes[0]);
      let operand2 = this.getOperand(paramModes[1]);
      if (operand1 !== 0) this.ip = operand2;
    } else if (opcode === 6) {
      let operand1 = this.getOperand(paramModes[0]);
      let operand2 = this.getOperand(paramModes[1]);
      if (operand1 === 0) this.ip = operand2;
    } else if (opcode === 7) {
      let operand1 = this.getOperand(paramModes[0]);
      let operand2 = this.getOperand(paramModes[1]);
      let destination = this.getDestination(paramModes[2]);
      this.state[destination] = operand1 < operand2 ? 1 : 0;
    } else if (opcode === 8) {
      let operand1 = this.getOperand(paramModes[0]);
      let operand2 = this.getOperand(paramModes[1]);
      let destination = this.getDestination(paramModes[2]);
      this.state[destination] = operand1 === operand2 ? 1 : 0;
    } else if (opcode === 9) {
      let operand = this.getOperand(paramModes[0]);
      this.relativeBase += operand;
    } else if (opcode === 99) {
      this.status = IntcodeComputer.STATUS_DONE;
    } else {
      // console.log(opcodeAndModes);
      // console.log(this.ip);
      throw new Error("invalid opcode " + opcode);
    }
  }

  getOperand(mode) {
    let res;
    let val = this.state[this.ip++] ?? 0;
    if (mode === 1) {
      res = val;
    } else if (mode === 2) {
      res = this.state[val + this.relativeBase] ?? 0;
    } else {
      res = this.state[val] ?? 0;
    }
    return res;
  }

  getDestination(mode) {
    let dest = this.state[this.ip++] ?? 0;
    if (mode === 2) {
      dest += this.relativeBase;
    }
    return dest;
  }

  reset() {
    this.status = IntcodeComputer.STATUS_READY;
    this.state = this.setState(this.originalProgram);;
    this.ip = 0;
    this.inputs = Array.from(this.originalInputs);
    this.outputs = [];
    this.relativeBase = 0;
  }

  setState(originalProgram) {
    let state = {};
    for (let i = 0; i < originalProgram.length; i++) {
      state[i] = originalProgram[i];
    }
    return state;
  }
}
