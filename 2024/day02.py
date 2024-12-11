from typing import List


infile = open('inputs/day02.txt', 'r')
lines = [[int(num) for num in line.split(' ')] for line in infile]


def is_safe(line: List[int]) -> bool:
    is_increasing = True
    is_decreasing = True

    for i in range(len(line) - 1):
        if line[i] >= line[i + 1]:
            is_increasing = False
        if line[i] <= line[i + 1]:
            is_decreasing = False
        diff = abs(line[i] - line[i + 1])
        if diff > 3:
            return False
    return is_increasing or is_decreasing


safe_ct = len([1 for line in lines if is_safe(line)])
print(f"Part 1: {safe_ct}")


safe_ct = 0
for line in lines:
    vars = [line]
    for i in range(len(line)):
        vars.append(line[0:i] + line[i + 1:])
    if any([is_safe(var) for var in vars]):
        safe_ct += 1
print(f"Part 2: {safe_ct}")

infile.close()