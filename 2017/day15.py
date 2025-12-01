from pathlib import Path
import time


def main():
    lines = Path("inputs/day15.txt").read_text().splitlines()
    a = int(lines[0].split(' ')[-1])
    b = int(lines[1].split(' ')[-1])
    total = 0
    for i in range(40_000_000):
        a *= 16807
        a %= 2147483647
        b *= 48271
        b %= 2147483647
        if a & ((1 << 16) - 1) == b & ((1 << 16) - 1):
            total += 1
    print(f"Part 1: {total}")

    a = int(lines[0].split(' ')[-1])
    b = int(lines[1].split(' ')[-1])
    total = 0
    avals = []
    bvals = []
    pairs = 0
    while pairs < 5_000_000:
        a *= 16807
        a %= 2147483647
        b *= 48271
        b %= 2147483647
        if a % 4 == 0:
            avals.append(a)
        if b % 8 == 0:
            bvals.append(b)
        if (len(avals) > 0 and len(bvals) > 0):
            pairs += 1
            aval = avals.pop(0)
            bval = bvals.pop(0)
            if aval & ((1 << 16) - 1) == bval & ((1 << 16) - 1):
                total += 1


if __name__ == "__main__":
    start = time.time()
    main()
    end = time.time()
    elapsed = end - start
    print(f"Execution time: {elapsed:.4f} seconds")
