from pathlib import Path
from day10 import get_sparse_hash, get_dense_hash, list_to_hex_str

grid_dim = 128

def main():
    key = Path("inputs/day14.txt").read_text()
    grid = []
    used = 0
    for i in range(grid_dim):
        knot_hash = get_knot_hash(key + '-' + str(i))
        binary = ''.join([bin(int(digit, 16))[2:].rjust(4, '0')
                         for digit in knot_hash])
        used += binary.count('1')
        grid.append(['.' if digit == '0' else '#' for digit in binary])
    print(f"Part 1: {used}")
    print(f"Part 2: {count_regions(grid)}")


def get_knot_hash(key: str) -> str:
    lengths = [ord(c) for c in key]
    lengths += [17, 31, 73, 47, 23]
    sparse_hash = get_sparse_hash(lengths, list(range(256)), 64)
    dense_hash = get_dense_hash(sparse_hash)
    return list_to_hex_str(dense_hash)


def count_regions(grid: list[str]) -> int:
    regions = 0
    for i in range(grid_dim):
        for j in range(grid_dim):
            if grid[i][j] == '#':
                regions += 1
                get_region(grid, i, j)
    return regions


def get_region(grid, row, col) -> None:
    queue = [(row, col)]
    while len(queue) > 0:
        curr = queue.pop(0)
        row = curr[0]
        col = curr[1]
        grid[curr[0]][curr[1]] = '!'
        neighbors = get_neighbors(row, col)
        for neighbor in neighbors:
            if grid[neighbor[0]][neighbor[1]] == '#':
                queue.append(neighbor)


def get_neighbors(row: int, col: int) -> list[tuple[int, int]]:
    neighbors = []
    if row > 0:
        neighbors.append((row - 1, col))
    if row < grid_dim - 1:
        neighbors.append((row + 1, col))
    if col > 0:
        neighbors.append((row, col - 1))
    if col < grid_dim - 1:
        neighbors.append((row, col + 1))
    return neighbors


if __name__ == "__main__":
    main()
