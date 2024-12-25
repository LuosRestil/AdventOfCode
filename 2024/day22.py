import os
import pathlib

path = os.path.join(pathlib.Path(
    __file__).parent.absolute(), "inputs", "day22.txt")
infile = open(path)
lines = [int(line.strip()) for line in infile.readlines()]
infile.close()


def mix(secret, num):
    return secret ^ num


def prune(num):
    return num % 16777216


def get_next(secret):
    # step 1
    secret = prune(mix(secret, secret * 64))
    # step 2
    secret = prune(mix(secret, secret // 32))
    # step 3
    secret = prune(mix(secret, secret * 2048))
    return secret

def process(initial, iters, num_lines, line_num, seqs):
    secret = initial
    seq = []
    for i in range(iters):
        next_secret = get_next(secret)
        val = next_secret % 10
        last_val = secret % 10
        diff = val - last_val
        seq.append(diff)

        if len(seq) > 4:
            seq.pop(0)
        if len(seq) == 4:
            seq_tup = tuple(seq)
            if seqs.get(seq_tup) == None:
                seqs[seq_tup] = [None for _ in range(num_lines)]
            if seqs[seq_tup][line_num] == None:
                seqs[seq_tup][line_num] = val

        secret = next_secret
    return secret


total = 0
num_lines = len(lines)
seqs = {}
for i in range(num_lines):
    total += process(lines[i], 2000, num_lines, i, seqs)
print(f'Part 1: {total}')

best = 0
for key in seqs:
    total = sum([num for num in seqs[key] if num != None])
    if total > best:
        best = total
print(f'Part 2: {best}')
