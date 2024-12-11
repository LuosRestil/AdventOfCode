infile = open('inputs/day04.txt', 'r')
lines = [line.strip() for line in infile.readlines()]
row_limit = len(lines) - 1
col_limit = len(lines[0]) - 1

def check_xmas(lines, row, col) -> int:
    total = 0
    #up
    if row - 3 >= 0 and lines[row-1][col] == "M" and lines[row-2][col] == "A" and lines[row-3][col] == "S":
        total += 1
    #down
    if row + 3 <= row_limit and lines[row+1][col] == "M" and lines[row+2][col] == "A" and lines[row+3][col] == "S":
        total += 1
    #left
    if col - 3 >= 0 and lines[row][col-1] == "M" and lines[row][col-2] == "A" and lines[row][col-3] == "S":
        total += 1
    #right
    if col + 3 <= col_limit and lines[row][col+1] == "M" and lines[row][col+2] == "A" and lines[row][col+3] == "S":
        total += 1
    #up/left
    if row - 3 >= 0 and col - 3 >= 0 and lines[row-1][col-1] == "M" and lines[row-2][col-2] == "A" and lines[row-3][col-3] == "S":
        total += 1
    #up/right
    if row - 3 >= 0 and col + 3 <= col_limit and lines[row-1][col+1] == "M" and lines[row-2][col+2] == "A" and lines[row-3][col+3] == "S":
        total += 1
    #down/left
    if row + 3 <= row_limit and col - 3 >= 0 and lines[row+1][col-1] == "M" and lines[row+2][col-2] == "A" and lines[row+3][col-3] == "S":
        total += 1
    #down/right
    if row + 3 <= row_limit and col + 3 <= col_limit and lines[row+1][col+1] == "M" and lines[row+2][col+2] == "A" and lines[row+3][col+3] == "S":
        total += 1
    return total

def check_xmas_2(lines, row, col) -> bool:
    if row-1 < 0 or col-1 < 0 or row+1 > row_limit or col+1 > col_limit:
        return False
    upleft = lines[row-1][col-1]
    downright = lines[row+1][col+1]
    if not (upleft=='M' and downright=='S' or upleft=='S' and downright=='M'):
        return False
    upright = lines[row-1][col+1]
    downleft = lines[row+1][col-1]
    if not (upright=='M' and downleft=='S' or upright=='S' and downleft=='M'):
        return False
    return True

total = 0
for row in range(len(lines)):
    for col in range(len(lines[0])):
        if lines[row][col] == "X":
            total += check_xmas(lines, row, col)
print(f"Part 1: {total}")

total = 0
for row in range(len(lines)):
    for col in range(len(lines[0])):
        if lines[row][col] == "A":
            if check_xmas_2(lines,row,col):
                total+=1
print(f"Part 2: {total}")

infile.close()