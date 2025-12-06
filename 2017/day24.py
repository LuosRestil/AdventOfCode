from functools import reduce
from pathlib import Path


class Component:
    def __init__(self, a: int, b: int):
        self.a = a
        self.b = b
        self.strength = a + b

    def has(self, x: int) -> bool:
        return self.a == x or self.b == x

    def __str__(self) -> str:
        return f"{self.a}/{self.b}"

    __repr__ = __str__


def main():
    components: list[Component] = [
        Component(int(line.split('/')[0]), int(line.split('/')[1]))
        for line in Path("inputs/day24.txt").read_text().splitlines()]
    bridges = get_all_bridges(0, components)
    strongest = 0
    longest = 0
    longest_strength = 0
    for bridge in bridges:
        strength = reduce(lambda acc, curr: acc + curr.strength, bridge, 0)
        length = len(bridge)
        if (length > longest or length == longest and strength > longest_strength):
            longest = length
            longest_strength = strength
        if strength > strongest:
            strongest = strength
    print(f"Part 1: {strongest}")
    print(f"Part 2: {longest_strength}")

def get_all_bridges(root: int, components: list[Component]) -> list[list[Component]]:
    bridges: list[list[Component]] = []
    for i in range(len(components)):
        component = components[i]
        if component.has(root):
            open_end = component.b if component.a == root else component.a
            for bridge in get_all_bridges(open_end, components[:i] + components[i+1:]):
                bridge.insert(0, component)
                bridges.append(bridge)
    if len(bridges) == 0:
        return [[]]
    return bridges


def get_strength(bridge: list[Component]):
    return 


if __name__ == "__main__":
    main()
