from pathlib import Path
import itertools


def main():
    input: list[str] = Path(
        "inputs/day04.txt").read_text().splitlines()
    print(f"Part 1: {len([pp for pp in input if is_valid(pp)])}")
    print(f"Part 2: {len([pp for pp in input if is_valid(pp, True)])}")


def is_valid(passphrase: str, anagrams = False) -> bool:
    words = passphrase.split()
    for i in range(len(words) - 1):
        for j in range(i + 1, len(words)):
            word = words[i]
            other = words[j]
            if (word == other): return False
            if (anagrams):
                perms = [''.join(perm) for perm in itertools.permutations(other)]
                if any([word == perm for perm in perms]): return False
    return True


if __name__ == "__main__":
    main()
