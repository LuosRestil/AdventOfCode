from pathlib import Path
import time

HORIZ = 1
VERT = 2


def main():
    tiles = [
        [int(num) for num in line.split(',')]
        for line in Path("inputs/day09.txt").read_text().splitlines()
    ]
    lines = [(tiles[i], tiles[i+1]) for i in range(len(tiles) - 1)]
    lines.append((tiles[0], tiles[-1]))

    max_size = 0
    max_green_size = 0
    for i in range(0, len(tiles) - 1):
        for j in range(i + 1, len(tiles)):
            a = tiles[i]
            b = tiles[j]
            size = (abs(a[0] - b[0]) + 1) * (abs(a[1] - b[1]) + 1)
            if size > max_size:
                max_size = size
            if is_green(a, b, lines) and size > max_green_size:
                max_green_size = size
    print(f"Part 1: {max_size}")
    print(f"Part 2: {max_green_size}")


def is_green(a, b, lines) -> bool:
    min_x = min(a[0], b[0])
    max_x = max(a[0], b[0])
    min_y = min(a[1], b[1])
    max_y = max(a[1], b[1])

    top_left = (min_x, min_y)
    bottom_right = (max_x, max_y)
    tl_int: dict | None = {'left': None,
                           'right': None, 'up': None, 'down': None}
    br_int: dict | None = {'left': None,
                           'right': None, 'up': None, 'down': None}

    for line in lines:
        # VERTICALS
        if get_line_type(line) == VERT:
            # top left
            if between(top_left[1], line[0][1], line[1][1]):
                intersection = (line[0][0], top_left[1])
                on_line_end = intersection[1] == line[0][1] or intersection[1] == line[1][1]
                if intersection[0] <= top_left[0]:
                    # left
                    tl_int['left'] = {
                        'intersection': intersection, 'inside': not on_line_end}
                if intersection[0] > top_left[0]:
                    # right
                    if tl_int['right'] == None or tl_int['right']['intersection'] == top_left:
                        tl_int['right'] = {
                            'intersection': intersection, 'inside': not on_line_end}
                    else:
                        if on_line_end:
                            if (not tl_int['right']['inside']) and tl_int['right']['intersection'][0] < intersection[0]:
                                tl_int['right'] = {
                                    'intersection': intersection, 'inside': not on_line_end}
                        else:
                            if (not tl_int['right']['inside']) or tl_int['right']['intersection'][0] > intersection[0]:
                                tl_int['right'] = {
                                    'intersection': intersection, 'inside': not on_line_end}
            # bottom right
            if between(bottom_right[1], line[0][1], line[1][1]):
                intersection = (line[0][0], bottom_right[1])
                on_line_end = intersection[1] == line[0][1] or intersection[1] == line[1][1]
                if intersection[0] < bottom_right[0]:
                    # left
                    if br_int['left'] == None or br_int['left']['intersection'] == bottom_right:
                        br_int['left'] = {
                            'intersection': intersection, 'inside': not on_line_end}
                    else:
                        if on_line_end:
                            if (not br_int['left']['inside']) and br_int['left']['intersection'][0] > intersection[0]:
                                br_int['left'] = {
                                    'intersection': intersection, 'inside': not on_line_end}
                        else:
                            if (not br_int['left']['inside']) or br_int['left']['intersection'][0] < intersection[0]:
                                br_int['left'] = {
                                    'intersection': intersection, 'inside': not on_line_end}
                if intersection[0] >= bottom_right[0]:
                    # right
                    br_int['right'] = {
                        'intersection': intersection, 'inside': not on_line_end}
        # HORIZONTALS
        else:
            # top left
            if between(top_left[0], line[0][0], line[1][0]):
                intersection = (top_left[0], line[0][1])
                on_line_end = intersection[0] == line[0][0] or intersection[0] == line[1][0]
                if intersection[1] <= top_left[1]:
                    # up
                    tl_int['up'] = {'intersection': intersection,
                                    'inside': not on_line_end}
                if intersection[1] > top_left[1]:
                    # down
                    if tl_int['down'] == None or tl_int['down']['intersection'] == top_left:
                        tl_int['down'] = {
                            'intersection': intersection, 'inside': not on_line_end}
                    else:
                        if on_line_end:
                            if (not tl_int['down']['inside']) and tl_int['down']['intersection'][1] < intersection[1]:
                                tl_int['down'] = {
                                    'intersection': intersection, 'inside': not on_line_end}
                        else:
                            if (not tl_int['down']['inside']) or tl_int['down']['intersection'][1] > intersection[1]:
                                tl_int['down'] = {
                                    'intersection': intersection, 'inside': not on_line_end}
            # bottom right
            if between(bottom_right[0], line[0][0], line[1][0]):
                intersection = (bottom_right[0], line[0][1])
                on_line_end = intersection[0] == line[0][0] or intersection[0] == line[1][0]
                if intersection[1] < bottom_right[1]:
                    # up
                    if br_int['up'] == None or br_int['up']['intersection'] == bottom_right:
                        br_int['up'] = {
                            'intersection': intersection, 'inside': not on_line_end}
                    else:
                        if on_line_end:
                            if (not br_int['up']['inside']) and br_int['up']['intersection'][0] > intersection[0]:
                                br_int['up'] = {
                                    'intersection': intersection, 'inside': not on_line_end}
                        else:
                            if (not br_int['up']['inside']) or br_int['up']['intersection'][0] < intersection[0]:
                                br_int['up'] = {
                                    'intersection': intersection, 'inside': not on_line_end}
                if intersection[1] >= bottom_right[1]:
                    # down
                    br_int['down'] = {
                        'intersection': intersection, 'inside': not on_line_end}

    if any(val == None for val in tl_int.values()) or any(val == None for val in br_int.values()):
        return False
    
    if (
        tl_int['right']['intersection'][0] < max_x or
        tl_int['down']['intersection'][1] < max_y or
        br_int['left']['intersection'][0] > min_x or
        br_int['up']['intersection'][1] > min_y
    ):
        return False
    
    return True


def get_line_type(line):
    if line[0][1] == line[1][1]:
        return HORIZ
    return VERT


def between(val, a, b) -> bool:
    start = min(a, b)
    end = max(a, b)
    return val >= start and val <= end


if __name__ == "__main__":
    start = time.time()
    main()
    end = time.time()
    elapsed = end - start
    print(f"Execution time: {elapsed:.4f} seconds")
