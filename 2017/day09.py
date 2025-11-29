from pathlib import Path


def main():
    s = Path("inputs/day09.txt").read_text()

    total = 0
    depth = 0
    ignore = False
    garbage = False
    garbage_chars = 0

    for c in s:
        if ignore:
            ignore = False
            continue

        if c == '!':
            ignore = True
            continue

        if garbage:
            if c == '>':
                garbage = False
            else:
                garbage_chars += 1
            continue

        if c == '{':
            depth += 1
        elif c == '}':
            total += depth
            depth -= 1
        elif c == '<':
            garbage = True

    print(f"Part 1: {total}")
    print(f"Part 2: {garbage_chars}")


if __name__ == "__main__":
    main()
