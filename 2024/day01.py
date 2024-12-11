import re

infile = open('inputs/day01.txt', 'r')
lines = infile.readlines()
pairs = [re.split(r'\s+', line) for line in lines]
nums = [[int(pair[0]), int(pair[1])] for pair in pairs]
left = sorted([num[0] for num in nums])
right = sorted([num[1] for num in nums])
diff = 0
for (l, r) in zip(left, right):
    diff += abs(l - r)
print(f'Part 1: {diff}')

sim_score = 0
for num in left:
    sim_score += right.count(num) * num
print(f'Part 2: {sim_score}')

infile.close()