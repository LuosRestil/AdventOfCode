import time

start = time.time()

next_pos_mods = {
    '^': [-1, 0],
    'v': [1, 0],
    '<': [0, -1],
    '>': [0, 1]
}
turns = {
    '^': '>',
    'v': '<',
    '<': '^',
    '>': 'v'
}
filename = 'inputs/day06.txt'


def run_pt_1():
    grid = get_grid()
    path = solve(grid)
    return path


def run_pt_2(trodden):
    grid = get_grid()
    guard = get_guard(grid)
    count = 0
    for pos in trodden:
        if pos[0] == guard['pos'][0] and pos[1] == guard['pos'][1]:
            continue
        grid[pos[0]][pos[1]] = '#'
        completed = solve(grid)
        if not completed:
            count += 1
        grid[pos[0]][pos[1]] = '.'
    print(f'Part 2: {count}')


def solve(grid):
    guard = get_guard(grid)
    path = {(guard['pos'][0], guard['pos'][1]): ['^']}
    while is_in_grid(grid, guard['pos']):
        if not tick(grid, guard, path):
            return None
    return path


def tick(grid, guard, path) -> bool:
    move(grid, guard)
    path_key = (guard['pos'][0], guard['pos'][1])
    if path_key in path and guard['dir'] in path[path_key]:
        return False
    if is_in_grid(grid, guard['pos']):
        path[path_key] = [] if not path_key in path else path[path_key]
        path[path_key].append(guard['dir'])
    return True


def move(grid, guard):
    next_pos_mod = next_pos_mods[guard['dir']]
    next_pos = [guard['pos'][0] + next_pos_mod[0],
                guard['pos'][1] + next_pos_mod[1]]
    if is_in_grid(grid, next_pos) and grid[next_pos[0]][next_pos[1]] == '#':
        guard['dir'] = turns[guard['dir']]
    else:
        guard['pos'] = next_pos


def get_guard(grid):
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '^':
                return {'pos': [i, j], 'dir': '^'}


def is_in_grid(grid, pos):
    return pos[0] >= 0 and pos[0] < len(grid) and pos[1] >= 0 and pos[1] < len(grid[0])


def get_grid():
    infile = open(filename, 'r')
    grid = [list(line.strip()) for line in infile.readlines()]
    infile.close()
    return grid


def print_grid(grid):
    for row in grid:
        for col in row:
            print(col, end='')
        print('\n', end='')


path = run_pt_1()
print(f"Part 1: {len(path.keys())}")

run_pt_2(path.keys())

end = time.time()
print(f'time: {end - start}s')
