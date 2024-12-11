import time

start = time.time()

infile = open('inputs/day07.txt', 'r')
lines = infile.readlines()
infile.close()

lines = [line.strip().split(':') for line in lines]
lines = [
    {
        'total': int(line[0]), 
        'operands': [int(num) for num in line[1].strip().split(' ')]
    } for line in lines
]

def is_possible(target, operands, allow_third_operator=False):
    if len(operands) == 1:
        return target == operands[0]
    plus = is_possible(target, [operands[0]+operands[1]] + operands[2:], allow_third_operator)
    if plus: return True
    times = is_possible(target, [operands[0]*operands[1]] + operands[2:], allow_third_operator) 
    if times: return True
    if allow_third_operator:
        concat = is_possible(target, [int(str(operands[0]) + str(operands[1]))] + operands[2:], allow_third_operator)
        if concat: return True
    return False


total = 0
for line in lines:
    if is_possible(line['total'], line['operands']):
        total += line['total']
print(f'Part 1: {total}')

total = 0
for line in lines:
    if is_possible(line['total'], line['operands'], allow_third_operator=True):
        total += line['total']

print(f'Part 2: {total}')

end = time.time()

print(f'time: {end - start}s')