from pathlib import Path


def main():
    lines = Path("inputs/day13.txt").read_text().splitlines()
    scanners = get_scanners(lines)
    severity = 0
    for i in range(max(scanners)):
        if i in scanners and scanners[i]["idx"] == 0:
            severity += i * scanners[i]["range"]
        tick(scanners)

    print(f"Part 1: {severity}")

    picos = -1
    scanners = get_scanners(lines)
    safe = False
    while not safe:
        safe = True
        picos += 1
        for scanner in scanners:
            if (scanner + picos) % (scanners[scanner]["range"] + (scanners[scanner]["range"] - 2)) == 0:
                safe = False
                break

    print(f"part 2: {picos}")


def get_scanners(lines: list[str]) -> dict:
    scanners = dict()
    for line in lines:
        stats = [int(stat) for stat in line.split(': ')]
        scanners[stats[0]] = {"range": stats[1], "idx": 0, "dir": 1}
    return scanners


def tick(scanners: dict):
    for key in scanners:
        scanner = scanners[key]
        scanner["idx"] += scanner["dir"]
        if scanner["idx"] == 0 or scanner["idx"] == scanner["range"] - 1:
            scanner["dir"] *= -1


if __name__ == "__main__":
    main()


# 2 -> 2   add 0
# 3 -> 4   add 1
# 4 -> 6   add 2
# 5 -> 8   add 3
# 6 -> 10  add 4
# 