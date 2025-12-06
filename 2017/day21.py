from pathlib import Path
from pprint import pprint
import time


def main():
    lines = Path("inputs/day21.txt").read_text().splitlines()
    transformations = {}
    for line in lines:
        sp = line.split(' => ')
        key = sp[0]
        val = sp[1]
        for variation in get_variations(key):
            transformations[variation] = val

    run(transformations, 5)
    run(transformations, 18)


def run(transformations, iterations):
    grid = [['.#./..#/###']]
    for _ in range(iterations):
        grid = expand(grid, transformations)
    total = 0
    for row in grid:
        for chunk in row:
            total += chunk.count("#")
    print(f"Answer: {total}")


def expand(grid: list[list[str]], transformations) -> list[list[str]]:
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            grid[i][j] = transformations[grid[i][j]]
    grid_arr = grid_to_arr(grid)
    return split(grid_arr)


def grid_to_arr(grid: list[list[str]]) -> list[str]:
    arr = []
    for i in range(len(grid)):
        row = grid[i]
        for j in range(len(row)):
            chunk = row[j]
            sp = chunk.split('/')
            for k in range(len(sp)):
                if j == 0:
                    arr.append(sp[k])
                else:
                    arr[i*len(sp)+k] += sp[k]
    return arr


def split(grid_arr: list[str]) -> list[list[str]]:
    grid = []
    chunk_size = 2 if len(grid_arr) % 2 == 0 else 3
    for i in range(len(grid_arr) // chunk_size):
        row = []
        row_idx = i * chunk_size
        for j in range(len(grid_arr) // chunk_size):
            col_idx = j * chunk_size
            chunk = []
            for k in range(chunk_size):
                chunk.append(grid_arr[row_idx + k]
                             [col_idx:col_idx + chunk_size])
            row.append('/'.join(chunk))
        grid.append(row)
    return grid


def total_size(grid: list[list[str]]) -> int:
    grid_len = len(grid)
    chunk_size = len(grid[0][0].replace('/', ''))
    row_len = len(grid[0])
    return grid_len * chunk_size * row_len


def get_variations(chunk: str) -> set[str]:
    variations = set()
    for _ in range(4):
        chunk = rotate(chunk)
        variations.add(chunk)
        variations.add(flip_h(chunk))
        variations.add(flip_v(chunk))
    return variations


def flip_h(chunk: str) -> str:
    rows = [list(row) for row in chunk.split('/')]
    for row in rows:
        row[0], row[-1] = row[-1], row[0]
    return '/'.join([''.join(row) for row in rows])


def flip_v(chunk: str) -> str:
    rows = chunk.split('/')
    rows[0], rows[-1] = rows[-1], rows[0]
    return '/'.join(rows)


def rotate(chunk) -> str:
    rows = chunk.split('/')
    arr = []
    for i in range(len(rows)):
        row = []
        for j in range(len(rows)):
            row.append('*')
        arr.append(row)

    for i in range(len(rows[0])):
        arr[i][-1], arr[i][0] = rows[0][i], rows[-1][i]
    if (len(arr) == 3):
        arr[0][1], arr[-1][1], arr[1][1] = rows[1][0], rows[1][-1], rows[1][1]
    return '/'.join(''.join(row) for row in arr)


def print_chunk(chunk: str) -> None:
    rows = chunk.split('/')
    for row in rows:
        print(row)


def print_grid(grid: list[list[str]]) -> None:
    for row in grid:
        row = [chunk.split('/') for chunk in row]
        for i in range(len(row[0])):
            for chunk in row:
                print(chunk[i], end='')
            print()
    print()


if __name__ == "__main__":
    start = time.time()
    main()
    end = time.time()
    print(f"Execution time: {end-start:.4f} seconds")
