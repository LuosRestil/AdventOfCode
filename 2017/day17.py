from pathlib import Path


def main():
    steps = int(Path("inputs/day17.txt").read_text())
    buff = [0]
    pos = 0
    for i in range(2017):
        pos = (pos + steps) % (i + 1)
        buff.insert(pos + 1, i + 1)
        pos += 1
    _2017 = buff.index(2017)
    print(f"Part 1: {buff[_2017 + 1]}")

    after_zero = None
    for i in range(50_000_000):
        pos = (pos + steps) % (i + 1)
        if pos == 0:
            after_zero = i + 1
        pos += 1
    print(f"Part 2: {after_zero}")


if __name__ == "__main__":
    main()
