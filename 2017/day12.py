from pathlib import Path

def main():
    rows = Path("inputs/day12.txt").read_text().splitlines()
    pipes = {}
    for row in rows:
        split = row.split(' <-> ')
        pipe = int(split[0])
        children = [int(child) for child in split[1].split(', ')]
        pipes[pipe] = children
    print(f"Part 1: {get_children(0, pipes, set([0]))}")

    grouped = set()
    groups = 0
    while len(grouped) < len(rows):
        for pipe in pipes:
            if pipe not in grouped:
                groups += 1
                get_children(pipe, pipes, grouped)
    print(f"Part 2: {groups}")

def get_children(pipe: int, pipes: dict[int, list[int]], in_group: set[int]) -> int:
    total = 1
    for child in pipes[pipe]:
        if child not in in_group:
            in_group.add(child)
            total += get_children(child, pipes, in_group)
    return total
    
    
if __name__ == "__main__":
    main()
        