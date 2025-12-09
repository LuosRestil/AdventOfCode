from pathlib import Path

HORIZ = 1
VERT = 2


def main():
    tiles = [
        [int(num) for num in line.split(',')]
        for line in Path("inputs/day09sample.txt").read_text().splitlines()
    ]
    lines = [[tiles[i], tiles[i+1]] for i in range(len(tiles) - 1)]
    lines.append([tiles[0], tiles[-1]])

    rect_lines = [
        [[7,1], [9,1]],
        [[9,1], [9,5]],
        [[9,5], [7,5]],
        [[7,5], [7,1]],
    ]
    lines = [
        [[9,7], [9,5]],
        [[9,5], [2,5]],
        [[2,3], [7,3]],
    ]
    for rl in rect_lines:
        for line in lines:
            print(f"rl: {rl}, line: {line}, cross: {cross(rl, line)}")

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
            print(f"{a}, {b}, is green: {is_green(a, b, lines)}")
    print(f"Part 1: {max_size}")
    print(f"Part 2: {max_green_size}")


def is_green(a, b, lines) -> bool:
    min_x = min(a[0], b[0])
    max_x = max(a[0], b[0])
    min_y = min(a[1], b[1])
    max_y = max(a[1], b[1])
    rect_lines = [
        [[min_x, min_y], [max_x, min_y]],
        [[max_x, min_y], [max_x, max_y]],
        [[max_x, max_y], [min_x, max_y]],
        [[min_x, max_y], [min_x, min_y]],
    ]
    for rect_line in rect_lines:
        for line in lines:
            if cross(rect_line, line):
                return False
    return True


def cross(base, target) -> bool:
    base_type = get_line_type(base)
    target_type = get_line_type(target)
    if base_type == target_type: return False
    
    if base_type == HORIZ:
        if between(base[0][1], target[0][1], target[1][1], inclusive=True) and between(target[0][0], base[0][0], base[1][0]):
            return True
    else:
        if between(base[0][0], target[0][0], target[1][0], inclusive=True) and between(target[0][1], base[0][1], base[1][1]):
            return True
    return False

    
def get_line_type(line):
    if line[0][1] == line[1][1]:
        return HORIZ
    return VERT


def between(val, a, b, inclusive=False) -> bool:
    start = min(a, b)
    end = max(a, b)
    if inclusive:
        return val >= start and val <= end
    else:
        return val > start and val < end


if __name__ == "__main__":
    main()
