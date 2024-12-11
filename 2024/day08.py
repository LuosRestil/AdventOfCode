import time
start = time.time()

def print_grid(grid):
    for row in grid:
        for col in row:
            print(col, end='')
        print('\n', end='')

def is_in_grid(grid, pos):
    return pos[0] >= 0 and pos[0] < len(grid) and pos[1] >= 0 and pos[1] < len(grid[0])

filename = 'inputs/day08.txt'
infile = open(filename, 'r')
grid = [list(line.strip()) for line in infile.readlines()]
# print_grid(grid)
infile.close()

antennae = dict()
for i in range(len(grid)):
    for j in range(len(grid[0])):
        ch = grid[i][j]
        if ch != '.':
            if not ch in antennae:
                antennae[ch] = []
            antennae[ch].append((i, j))

antinodes = set()
antinodes_2 = set()
for locs in antennae.values():
    for i in range(len(locs)):
        loc_a = locs[i]
        for j in range(i + 1, len(locs)):
            loc_b = locs[j]

            slope = (loc_a[0] - loc_b[0], loc_a[1] - loc_b[1])
            antinodes.add((loc_a[0] + slope[0], loc_a[1] + slope[1]))
            antinodes.add((loc_b[0] - slope[0], loc_b[1] - slope[1]))

            if slope[0] == 0:
                # add all in row
                for i in range(len(grid[0])):
                    antinodes_2.add((loc_a[0], i))
            elif slope[1] == 0:
                # add all in column
                for i in range(len(grid)):
                    antinodes_2.add((i, loc_a[1]))
            else:
                # follow slope both directions from loc_a
                pos = loc_a
                while (is_in_grid(grid, pos)):
                    antinodes_2.add((pos[0], pos[1]))
                    pos = (pos[0] + slope[0], pos[1] + slope[1])
                pos = loc_a
                while (is_in_grid(grid, pos)):
                    antinodes_2.add((pos[0], pos[1]))
                    pos = (pos[0] - slope[0], pos[1] - slope[1])


antinodes_on_grid = [antinode for antinode in antinodes if is_in_grid(grid, antinode)]
print(f'Part 1: {len(antinodes_on_grid)}')
print(f'Part 2: {len(antinodes_2)}')

end = time.time()
print(f'time: {(end - start) * 1000}ms')