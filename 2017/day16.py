from pathlib import Path


def main():
    instructions = Path("inputs/day16.txt").read_text().split(',')
    programs = [chr(i) for i in range(97, 113)]
    seen = set()
    for i in range(1_000_000_000 % 60):
        for instruction in instructions:
            if instruction[0] == 's':
                chunk_size = int(instruction[1:])
                programs = programs[-chunk_size:] + programs[:-chunk_size]
            elif instruction[0] == 'x':
                ab = instruction[1:].split('/')
                a = int(ab[0])
                b = int(ab[1])
                programs[a], programs[b] = programs[b], programs[a]
            else:  # p
                ab = instruction[1:].split('/')
                a = programs.index(ab[0])
                b = programs.index(ab[1])
                programs[a], programs[b] = programs[b], programs[a]
        if i == 0:
            print(f"Part 1: {''.join(programs)}")
    print(f"Part 2: {''.join(programs)}")


if __name__ == "__main__":
    main()
