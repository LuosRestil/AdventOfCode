from pathlib import Path
import re

def main():
    input: list[int] = [int(num) for num in re.split(r"\s+", Path("inputs/day06.txt").read_text())] 
    seen: dict[tuple[int, ...], int] = {tuple(input): 0}
    cycles = 1
    while True:
        redistribute(input)
        tup = tuple(input)
        if (tup in seen):
            cycle_size = cycles - seen[tup]
            break
        seen[tuple(input)] = cycles
        cycles += 1
    print(f"Part 1: {cycles}")
    print(f"Part 2: {cycle_size}")
    

def redistribute(input: list[int]) -> None:
    dist_amt = max(input)
    idx = input.index(dist_amt)
    input[idx] = 0
    idx += 1
    while dist_amt > 0:
        if idx == len(input):
            idx = 0
        input[idx] += 1
        dist_amt -= 1
        idx += 1
        
    
if __name__ == "__main__":
    main()
        