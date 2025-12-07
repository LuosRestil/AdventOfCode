from pathlib import Path


class Instruction:
    def __init__(self, opcode, x, y):
        self.opcode = opcode
        self.x = x
        self.y = y

    def __str__(self):
        return f"{self.opcode} {self.x} {self.y}"


class Program:
    i = 0
    sent_times = 0
    mul_times = 0
    target: list[int]

    def __init__(self, id, registers, queue):
        self.id = id
        self.registers = registers
        self.registers['p'] = self.id
        self.queue = queue

    def emit(self, value):
        self.target.append(value)

    def tick(self, instructions):
        if self.i >= len(instructions): return True
        jumped = False
        instruction = instructions[self.i]
        if instruction.opcode == 'snd':
            x = get_value(instruction.x, self.registers)
            self.emit(x)
            self.sent_times += 1
        if instruction.opcode == 'set':
            y = get_value(instruction.y, self.registers)
            self.registers[instruction.x] = y
        elif instruction.opcode == 'add':
            y = get_value(instruction.y, self.registers)
            self.registers[instruction.x] += y
        elif instruction.opcode == 'sub':
            y = get_value(instruction.y, self.registers)
            self.registers[instruction.x] -= y
        elif instruction.opcode == 'mul':
            y = get_value(instruction.y, self.registers)
            self.registers[instruction.x] *= y
            self.mul_times += 1
        elif instruction.opcode == 'mod':
            y = get_value(instruction.y, self.registers)
            self.registers[instruction.x] %= y
        elif instruction.opcode == 'rcv':
            if len(self.queue) == 0:
                return True
            self.registers[instruction.x] = self.queue.pop(0)
        elif instruction.opcode == 'jgz':
            x = get_value(instruction.x, self.registers)
            y = get_value(instruction.y, self.registers)
            if x > 0:
                self.i += y
                jumped = True
        elif instruction.opcode == 'jnz':
            x = get_value(instruction.x, self.registers)
            y = get_value(instruction.y, self.registers)
            if x != 0:
                self.i += y
                jumped = True
        if not jumped:
            self.i += 1
        return False


def main():
    instructions = [parse(instruction) for instruction in Path(
        "inputs/day23.txt").read_text().splitlines()]
    registers = {}
    for instruction in instructions:
        if not isinstance(instruction.x, int):
            registers[instruction.x] = 0
            
    program = Program(0, registers.copy(), [])
    finished = False
    while not finished:
        finished = program.tick(instructions)
    print(f"Part 1: {program.mul_times}")
    
    b = 106700
    c = 123700
    h = 0
    while b <= c:
        for d in range(2, b):
            needed_e = b / d
            if needed_e % 1 == 0 and needed_e < b:
                h += 1
                break
        b += 17
    print(f"Part 2: {h}")



def parse(instruction: str) -> Instruction:
    split = instruction.split(' ')
    opcode = split[0]
    x = None
    y = None
    try:
        x = int(split[1])
    except:
        x = split[1]
    if len(split) == 3:
        try:
            y = int(split[2])
        except:
            y = split[2]
    return Instruction(opcode, x, y)


def get_value(var, registers):
    return var if isinstance(var, int) else registers[var]


if __name__ == "__main__":
    main()
