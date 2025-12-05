from pathlib import Path

class Pos:
    def __init__(self, row: int, col: int):
        self.row = row
        self.col = col

def main():
    grid = Path("inputs/day19.txt").read_text().splitlines()
    pos = Pos(0, grid[0].index('|'))
    dir = 'd'
    chars = []
    steps = 0
    
    # O is the end of the path
    while True:
        steps += 1
        char = grid[pos.row][pos.col]
        if char.isalpha():
            chars.append(char)
            if char == 'O':
                break
        elif char == '+':
            if (dir == 'u' or dir == 'd'):
                if grid[pos.row][pos.col - 1] == '-' or grid[pos.row][pos.col].isalpha():
                    dir = 'l'
                else:
                    dir = 'r'
            else:
                if grid[pos.row - 1][pos.col] == '|' or grid[pos.row - 1][pos.col].isalpha():
                    dir = 'u'
                else:
                    dir = 'd'
        move(pos, dir)
    
    print(f"Part 1: {''.join(chars)}")
    print(f"Part 2: {steps}")


def move(pos: Pos, dir: str) -> None:
    if dir == 'd': pos.row += 1
    elif dir == 'u': pos.row -= 1
    elif dir == 'l': pos.col -= 1
    elif dir == 'r': pos.col += 1


if __name__ == "__main__":
    main()
        