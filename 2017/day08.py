from pathlib import Path


def main():
    instmap = {
        '==': eq,
        '!=': neq,
        '>': gt,
        '>=': gte,
        '<': lt,
        '<=': lte
    }

    registers = {}
    highest_value = 0
    for line in Path("inputs/day08.txt").read_text().splitlines():
        parts = line.split(' ')
        reg = parts[0]
        inc_dec = parts[1]
        amt = int(parts[2])
        comp_a = parts[4]
        inst = instmap[parts[5]]
        comp_b = int(parts[6])

        if not inst(registers.get(comp_a, 0), comp_b): continue

        if reg not in registers:
            registers[reg] = 0
        registers[reg] = registers[reg] + \
            amt if inc_dec == 'inc' else registers[reg] - amt
        if registers[reg] > highest_value:
            highest_value = registers[reg]
            
        

    print(f"Part 1: {max(v for (_, v) in registers.items())}")
    print(f"Part 2: {highest_value}")
    

def eq(a, b):
    return a == b

def neq(a, b):
    return a != b

def gt(a, b):
    return a > b

def gte(a, b):
    return a >= b

def lt(a, b):
    return a < b

def lte(a, b):
    return a <= b

if __name__ == "__main__":
    main()
        