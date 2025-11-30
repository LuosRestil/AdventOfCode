from pathlib import Path


def main():
    txt = Path("inputs/day11.txt").read_text()
    dirs = txt.split(',')
    row = 0
    col = 0
    max_dist = 0
    for dir in dirs:
        if dir == 'n':
            row -= 1
        elif dir == 's':
            row += 1
        else:
            if col % 2 == 0:
                if dir[0] == 's':
                    row += 1
            else:
                if dir[0] == 'n':
                    row -= 1

            col += 1 if dir[1] == 'e' else -1
        
        dist = get_distance(row, col)
        if dist > max_dist: max_dist = dist
    
    print(f"row: {row}, col: {col}")
    print(f"Part 1: {max_dist}")


def get_distance(row: int, col: int) -> int:
    min_val = abs(row)
    max_val = abs(col)
    if (min_val > max_val):
        min_val, max_val = max_val, min_val
    
    total = min_val
    max_val -= min_val // 2
    total += max_val
    if min_val % 2 != 0:
        total -= 1
    
    return total

    


if __name__ == "__main__":
    main()
