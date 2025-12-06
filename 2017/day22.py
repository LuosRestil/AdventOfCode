from pathlib import Path


def main():
    rows = Path("inputs/day22.txt").read_text().splitlines()
    grid = {}
    for i in range(len(rows)):
        for j in range(len(rows[0])):
            grid[(i, j)] = rows[i][j]
    dirs = ['u', 'r', 'd', 'l']
    pos = [len(rows) // 2, len(rows[0]) // 2]
    dir = 0

    caused_infection = 0
    for _ in range(10_000):
        key = (pos[0], pos[1])
        if key not in grid:
            grid[key] = '.'

        curr = grid[key]

        if curr == '#':
            dir += 1
            if dir == 4:
                dir = 0
            grid[key] = '.'
        elif curr == '.':
            dir -= 1
            if dir == -1:
                dir = 3
            grid[key] = '#'
            caused_infection += 1

        if dir == 0:  # u
            pos[0] -= 1
        elif dir == 1:  # r
            pos[1] += 1
        elif dir == 2:  # d
            pos[0] += 1
        elif dir == 3:  # l
            pos[1] -= 1
        else:
            raise Exception("oh god oh fuck")

    print(f"Part 1: {caused_infection}")

    grid = {}
    for i in range(len(rows)):
        for j in range(len(rows[0])):
            grid[(i, j)] = rows[i][j]
    pos = [len(rows) // 2, len(rows[0]) // 2]
    dir = 0

    caused_infection = 0
    for _ in range(10_000_000):
        key = (pos[0], pos[1])
        if key not in grid:
            grid[key] = '.'

        curr = grid[key]

        if curr == '.':
            dir -= 1
            if dir == -1:
                dir = 3
            grid[key] = '~'
        elif curr == '~':
            grid[key] = '#'
            caused_infection += 1
        elif curr == '#':
            dir += 1
            if dir == 4:
                dir = 0
            grid[key] = '!'
        elif curr == '!':
            if dir == 0 or dir == 1:
                dir += 2
            else:
                dir -= 2
            grid[key] = '.'

        if dir == 0:  # u
            pos[0] -= 1
        elif dir == 1:  # r
            pos[1] += 1
        elif dir == 2:  # d
            pos[0] += 1
        elif dir == 3:  # l
            pos[1] -= 1
        else:
            raise Exception("oh god oh fuck")

    print(f"Part 2: {caused_infection}")


if __name__ == "__main__":
    main()
