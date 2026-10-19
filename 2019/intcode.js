export default class IntcodeComputer {
  constructor(program) {
    this.program = program; // original loaded program
    this.state = Array.from(this.program); // current modified program state
    this.ip = 0; // instruction pointer
    this.done = false;
  }

  runProgram() {
    while (!this.tick()) {}
  }

  tick() {
    if (this.done) return this.done;
    let opcode = this.state[this.ip++];
    this.interpret(opcode);
    return this.done;
  }

  interpret(opcode) {
    if (opcode === 1) {
      let operand1Addr = this.state[this.ip++];
      let operand2Addr = this.state[this.ip++];
      let destination = this.state[this.ip++];
      this.state[destination] =
        this.state[operand1Addr] + this.state[operand2Addr];
    } else if (opcode === 2) {
      let operand1Addr = this.state[this.ip++];
      let operand2Addr = this.state[this.ip++];
      let destination = this.state[this.ip++];
      this.state[destination] =
        this.state[operand1Addr] * this.state[operand2Addr];
    } else if (opcode === 99) {
      this.done = true;
    } else {
      throw new Error("invalid opcode " + opcode);
    }
  }

  reset() {
    this.done = false;
    this.state = Array.from(this.program);
    this.ip = 0;
  }
}
