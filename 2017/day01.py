from pathlib import Path


def main():
    text = [int(c) for c in Path("inputs/day01.txt").read_text()]
    print(f"Part 1: {get_solution(text, 1)}")
    print(f"Part 2: {get_solution(text, len(text) // 2)}")


def get_solution(text: list[int], jumpsize: int) -> int:
    text_len = len(text)
    total = 0
    for i in range(text_len):
        if text[i] == text[(i + jumpsize) % text_len]:
            total += text[i]
    return total


if __name__ == '__main__':
    main()
