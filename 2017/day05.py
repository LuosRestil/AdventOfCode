from pathlib import Path

def main():
    run(False)
    run(True)
    
def run(is_pt_2: bool) -> None:
    inst = [int(num) for num in Path("inputs/day05.txt").read_text().splitlines()]
    idx = 0
    steps = 0
    while (idx >= 0 and idx < len(inst)):
        jmp = inst[idx]
        if is_pt_2 and jmp > 2:
            inst[idx] -= 1
        else:
            inst[idx] += 1
        idx += jmp
        steps += 1
    print(f"Part {2 if is_pt_2 else 1}: {steps}")
if __name__ == "__main__":
    main()
        