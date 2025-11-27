from pathlib import Path
import re

def main():
    lines = [
        [int(num) for num in re.split(r"\s+", line)] 
        for line in Path("inputs/day02.txt").read_text().splitlines()
    ]
    total = sum([max(line) - min(line) for line in lines])
    print(f"Part 1: {total}")
    
    total = 0
    for line in lines:
        for i in range(len(line) - 1):
            for j in range(i + 1, len(line)):
                a, b = line[i], line[j]
                low = min(a, b)
                high = max(a, b)
                div = high / low 
                if div % 1 == 0:
                    total += div
    print(f"Part 2: {total}")

if __name__ == "__main__":
    main()