infile = open('inputs/day05.txt', 'r')
lines = [line.strip() for line in infile.readlines()]

reading_pages = False
rules = {}
pages = []
for line in lines:
    if len(line) == 0:
        reading_pages = True
        continue
    if reading_pages:
        pages.append([int(num) for num in line.split(',')])
    else:
        split_rule = line.split('|')
        before = int(split_rule[0])
        after = int(split_rule[1])
        if not after in rules:
            rules[after] = set()
        rules[after].add(before)

def is_valid(page):
    valid = True
    for j in range(len(page) - 1):
        if not page[j] in rules: continue
        if any(num in rules[page[j]] for num in page[j+1:]):
            valid = False
            break
    return valid

def middle(page):
    return page[len(page) // 2]

valid_pages = []
invalid_pages = []
for i in range(len(pages)):
    page = pages[i]
    if is_valid(page):
        valid_pages.append(i)
    else:
        invalid_pages.append(i)

total = 0
for idx in valid_pages:
    page = pages[idx]
    total += middle(page)
print(f"Part 1: {total}")

def make_swap(page):
    for i in range(len(page) - 1):
        if not page[i] in rules: continue
        for j in range(i + 1, len(page)):
            if page[j] in rules[page[i]]:
                page.insert(i, page.pop(j))
                return

total = 0
for idx in invalid_pages:
    page = pages[idx]
    while not is_valid(page):
        make_swap(page)
    total += middle(page)
print(f"Part 2: {total}")