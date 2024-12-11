import re

infile = open('inputs/day03.txt', 'r')
text = infile.read()

def sum_muls(text):
    matches = re.findall(r'mul\((\d{1,3}),(\d{1,3})\)', text)
    return sum([(int(match[0]) * int(match[1])) for match in matches])


print(f"Part 1: {sum_muls(text)}")


do_idxs = [match.start() for match in re.finditer(r'do[^n]', text)]
dont_idxs = [match.start() for match in re.finditer("don't", text)]

do_text = text[:dont_idxs[0]]

last_dont = 0
for start_idx in do_idxs:
    if start_idx < last_dont: continue
    stop_idx = next((num for num in dont_idxs if num > start_idx), None)
    if not stop_idx:
        do_text += text[start_idx:]
        break
    do_text += text[start_idx:stop_idx]
    last_dont = stop_idx
print(f"Part 2: {sum_muls(do_text)}")


infile.close()