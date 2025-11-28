import math
from pathlib import Path
import pprint


def main():
    target = int(Path("inputs/day03.txt").read_text())
    print(f"Part 1: {pt1(target)}")
    print(f"Part 2: {pt2(target)}")


def pt1(target: int) -> int:
    grid = [[1]]
    next = 2
    while True:
        expand(grid)
        pos = [len(grid) - 2, len(grid[0]) - 1]
        while pos[0] > 0:
            grid[pos[0]][pos[1]] = next
            if next == target:
                return abs(pos[0] - math.floor(len(grid) / 2)) + abs(pos[1] - math.floor(len(grid[0]) / 2))
            pos[0] -= 1
            next += 1
        while pos[1] > 0:
            grid[pos[0]][pos[1]] = next
            if next == target:
                return abs(pos[0] - math.floor(len(grid) / 2)) + abs(pos[1] - math.floor(len(grid[0]) / 2))
            pos[1] -= 1
            next += 1
        while pos[0] < len(grid) - 1:
            grid[pos[0]][pos[1]] = next
            if next == target:
                return abs(pos[0] - math.floor(len(grid) / 2)) + abs(pos[1] - math.floor(len(grid[0]) / 2))
            pos[0] += 1
            next += 1
        while pos[1] < len(grid[0]):
            grid[pos[0]][pos[1]] = next
            if next == target:
                return abs(pos[0] - math.floor(len(grid) / 2)) + abs(pos[1] - math.floor(len(grid[0]) / 2))
            pos[1] += 1
            next += 1


def pt2(target: int) -> int:
    grid = [[1]]
    while True:
        expand(grid)
        pos = [len(grid) - 2, len(grid[0]) - 1]
        while pos[0] > 0:
            val = get_adjacent(grid, pos)
            grid[pos[0]][pos[1]] = val
            if val > target:
                return val
            pos[0] -= 1
        while pos[1] > 0:
            val = get_adjacent(grid, pos)
            grid[pos[0]][pos[1]] = val
            if val > target:
                return val
            pos[1] -= 1
        while pos[0] < len(grid) - 1:
            val = get_adjacent(grid, pos)
            grid[pos[0]][pos[1]] = val
            if val > target:
                return val
            pos[0] += 1
        while pos[1] < len(grid[0]):
            val = get_adjacent(grid, pos)
            grid[pos[0]][pos[1]] = val
            if val > target:
                return val
            pos[1] += 1


def do_thing(grid, pos, target, func):
    val = get_adjacent(grid, pos)
    grid[pos[0]][pos[1]] = val
    if val > target:
        return val
    func(pos)
    return None


def expand(grid: list[list[int]]) -> None:
    grid.insert(0, [0] * len(grid[0]))
    grid.append([0] * len(grid[0]))
    for row in grid:
        row.insert(0, 0)
        row.append(0)


def get_adjacent(grid: list[list[int]], pos: list[int]):
    total = 0
    for i in range(-1, 2):
        for j in range(-1, 2):
            new_pos = [pos[0] + i, pos[1] + j]
            if new_pos[0] >= 0 and new_pos[0] < len(grid) and new_pos[1] >= 0 and new_pos[1] < len(grid[0]):
                total += grid[pos[0] + i][pos[1] + j]
    return total


if __name__ == "__main__":
    main()
