import os
import time

def main():
    filename = 'inputs/day22.txt'
    path = os.path.join(os.path.dirname(__file__), filename)

    lines = []
    with open(path, 'r') as infile:
        lines = [line.strip() for line in infile.readlines()]

    deck_size = 10007

    lcf = get_lcf_from_input(lines, deck_size)
    print('Part 1: ' + str(lcf_compute(lcf, 2019, deck_size)))
    
    deck_size = 119315717514047
    lcf = get_lcf_from_input(lines, deck_size)
    lcf = pow_compose(lcf, 101741582076661, deck_size)
    print('Part 2: ' + str(lcf_compute_inverse(lcf, 2020, deck_size)))


def get_lcf_from_input(lines: list[str], m: int) -> tuple[int, int]:
    lcf = parse_lcf(lines[0])
    for i in range(1, len(lines)):
        line = lines[i]
        next = parse_lcf(line)
        lcf = lcf_compose(lcf, next, m)
    return lcf

def parse_lcf(line: str) -> tuple[int, int]:
    if line.startswith("deal into new stack"):
        return (-1, -1)
    elif line.startswith("cut"):
        return (1, -int(line.split(' ')[1]))
    elif line.startswith("deal with increment"):
        return (int(line.split(' ')[3]), 0)
    else:
        raise RuntimeError("oh god oh fuck")

def lcf_compose(a, b, m):
    return ((a[0] * b[0]) % m, (a[1] * b[0] + b[1]) % m)

def lcf_compute(lcf, x, m):
    return (lcf[0] * x + lcf[1]) % m

def lcf_compute_inverse(lcf, x, m):
    # division should be modular multiplicative inverse
    # Fermat's little theorem says that as long as the modulus m is a prime number then a**m mod m = a mod m. Working backwards, a**m−1 mod m = 1 = a⋅a**m−2 mod m, therefore the number we need is a**m−2 mod m.
    numerator = x - lcf[1]
    denominator = lcf[0]
    # a/b mod m = a⋅b**-1 mod m
    denom_to_neg_1 = pow_mod(denominator, m - 2, m)
    return (numerator * denom_to_neg_1) % m
    
def pow_compose(lcf: tuple[int, int], times: int, m: int) -> tuple[int, int]:
    g = (1, 0)
    while times > 0:
        if times % 2 != 0: # odd
            g = lcf_compose(g, lcf, m)
        times = times // 2
        lcf = lcf_compose(lcf, lcf, m)
    return g
    
def pow_mod(x, n, m):
    y = 1
    while n > 0:
        if n % 2 != 0:
            y = (y * x) % m
        n = n // 2
        x = (x * x) % m
    return y
    

if __name__ == "__main__":
    start = time.time()
    main()
    print(f"{round((time.time() - start) * 1000, 3)}ms")