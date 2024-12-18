import os
import pathlib

def main():
    global a, b, c, ptr, out

    path = os.path.join(pathlib.Path(__file__).parent.absolute(), "inputs", "day17.txt")

    infile = open(path)
    text = infile.read().split('\n\n')
    infile.close()

    reg = text[0].split('\n')
    a = int(reg[0].split(': ')[1])
    b = int(reg[1].split(': ')[1])
    c = int(reg[2].split(': ')[1])

    instructions = [int(num) for num in text[1].split(': ')[1].split(',')]

    ptr = 0
    out = []

    while ptr < len(instructions):
        res = perform_op(instructions[ptr], instructions[ptr+1])
        if res != None: out.append(res)

    print(f"Part 1: {','.join([str(num) for num in out])}")

    possibles = [0]
    for i in range(len(instructions) - 1, -1, -1):
        possibles2 = []
        while len(possibles) > 0:
            possible = possibles.pop() << 3
            for j in range(0, 8):
                ptr = 0
                out = []
                a = possible + j
                b = int(reg[1].split(': ')[1])
                c = int(reg[2].split(': ')[1])
                while ptr < len(instructions):
                    res = perform_op(instructions[ptr], instructions[ptr+1])
                    if res != None: out.append(res)
                target = instructions[i:]
                if out == target:
                    possibles2.append((possible + j))
        possibles = possibles2
        
    print(f'Part 2: {possibles[0]}')

def perform_op(operation, operand):
    global a, b, c, ptr, out

    inc_ptr = True
    ret_val = None
    match operation:
        case 0:
            a = int(a / 2 ** get_combo(operand))
        case 1:
            b = b ^ operand
        case 2:
            b = get_combo(operand) % 8
        case 3:
            if a != 0:
                ptr = operand
                inc_ptr = False
        case 4:
            b = b ^ c
        case 5:
            ret_val = get_combo(operand) % 8
        case 6:
            b = int(a / 2 ** get_combo(operand))
        case 7:
            c = int(a / 2 ** get_combo(operand))

    if inc_ptr:
        ptr += 2
    return ret_val


def get_combo(operand):
    global a, b, c, ptr, out

    if operand <= 3:
        return operand
    if operand == 4:
        return a
    if operand == 5:
        return b
    if operand == 6:
        return c


main()
