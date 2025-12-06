def main():
    state = 'a'
    idx = 0
    tape = {}
    for _ in range(12302209):
        (idx, state) = tick(idx, state, tape)
    print(f"Part 1: {sum(tape.values())}")

def tick(idx: int, state: str, tape: dict[int, int]) -> tuple[int, str]:
    if idx not in tape:
        tape[idx] = 0
    curr = tape[idx]
    if state == 'a':
        if curr == 0:
            tape[idx] = 1
            idx += 1
            state = 'b'
        else:
            tape[idx] = 0
            idx -= 1
            state = 'd'
    elif state == 'b':
        if curr == 0:
            tape[idx] = 1
            idx += 1
            state = 'c'
        else:
            tape[idx] = 0
            idx += 1
            state = 'f'
    elif state == 'c':
        if curr == 0:
            tape[idx] = 1
            idx -= 1
            state = 'c'
        else:
            tape[idx] = 1
            idx -= 1
            state = 'a'
    elif state == 'd':
        if curr == 0:
            tape[idx] = 0
            idx -= 1
            state = 'e'
        else:
            tape[idx] = 1
            idx += 1
            state = 'a'
    elif state == 'e':
        if curr == 0:
            tape[idx] = 1
            idx -= 1
            state = 'a'
        else:
            tape[idx] = 0
            idx += 1
            state = 'b'
    elif state == 'f':
        if curr == 0:
            tape[idx] = 0
            idx += 1
            state = 'c'
        else:
            tape[idx] = 0
            idx += 1
            state = 'e'

    return (idx, state)
    
    
if __name__ == "__main__":
    main()
        