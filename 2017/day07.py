from pathlib import Path


def main():
    lines = Path("inputs/day07.txt").read_text().splitlines()
    left = set()
    right = set()
    tower = dict()
    for line in lines:
        sp = line.split(' -> ')

        base = sp[0].split(' ')
        name = base[0]
        weight = int(base[1][1:-1])
        left.add(name)
        tower[name] = {"weight": weight, "children": []}

        if (len(sp) > 1):
            rs = sp[1]
            for child in rs.split(', '):
                right.add(child)
                tower[name]["children"].append(child)

    root: str = left.difference(right).pop()
    print(f"Part 1: {root}")

    off_balance = root
    required_weight = -1
    while len(tower[off_balance]["children"]) > 0:
        child_weights = dict()
        for child in tower[off_balance]["children"]:
            child_weight = get_weight(child, tower)
            if child_weight not in child_weights:
                child_weights[child_weight] = []
            child_weights[child_weight].append(child)

        if len(child_weights) == 1:
            item = child_weights.popitem()
            required_weight -= item[0] * len(item[1])
            break
        for weight in child_weights:
            if len(child_weights[weight]) == 1:
                off_balance = child_weights[weight][0]
            else:
                required_weight = weight
            
    print(f"Part 2: {required_weight}") 
            
    
def get_weight(elem, tower):
    weight = tower[elem]["weight"]
    for child in tower[elem]["children"]:
        weight += get_weight(child, tower)
    return weight

if __name__ == "__main__":
    main()
