import os
import time

def main():
    depth = None
    target = None

    filename = 'inputs/day22.txt'
    path = os.path.join(os.path.dirname(__file__), filename)

    with open(path, 'r') as infile:
        lines = infile.readlines()
        depth = int(lines[0].split(' ')[1])
        target_nums = [int(num) for num in lines[1].split(' ')[1].split(',')]
        target = {'x': target_nums[0], 'y': target_nums[1]}

    geologic_indices = []
    erosion_levels = []
    types = []
    for y in range(target['y'] + 1):
        g_row = []
        e_row = []
        t_row = []
        geologic_indices.append(g_row)
        erosion_levels.append(e_row)
        types.append(t_row)
        for x in range(target['x'] + 1):
            g_row.append(get_geologic_index(x, y, target, erosion_levels))
            e_row.append(get_erosion_level(x, y, geologic_indices, depth))
            t_row.append(erosion_levels[y][x] % 3)

    p1_ans = sum([sum(row) for row in types])
    print(f'Part 1: {p1_ans}') 


def get_geologic_index(x, y, target, erosion_levels):
    if y == 0 and x == 0: return 0
    if y == target['y'] and x == target['x']: return 0
    if y == 0: return x * 16807
    if x == 0: return y * 48271
    return erosion_levels[y][x - 1] * erosion_levels[y - 1][x]


def get_erosion_level(x, y, geologic_indices, depth):
    return (geologic_indices[y][x] + depth) % 20183


if __name__ == '__main__':
    start = time.time()
    main()
    print("--- %s seconds ---" % (time.time() - start))
    