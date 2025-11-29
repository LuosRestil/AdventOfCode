from pathlib import Path
from functools import reduce


def main():
    lengths = [int(length) for length in Path(
        "inputs/day10.txt").read_text().split(',')]
    nums = get_sparse_hash(lengths, list(range(256)), 1)
    print(f"Part 1: {nums[0] * nums[1]}")

    lengths = [ord(c) for c in list(Path("inputs/day10.txt").read_text())]
    lengths += [17, 31, 73, 47, 23]
    nums = get_sparse_hash(lengths, list(range(256)), 64)
    dense_hash = get_dense_hash(nums)
    print(f"Part 2: {list_to_hex_str(dense_hash)}")


def get_sparse_hash(lengths: list[int], nums: list[int], iters: int) -> list[int]:
    nums_len = len(nums)
    idx = 0
    skip_size = 0

    for i in range(iters):
        for length in lengths:
            start = idx
            end = idx + length - 1
            while start < end:
                a = start % nums_len
                b = end % nums_len
                nums[a], nums[b] = nums[b], nums[a]
                start += 1
                end -= 1
            idx = (idx + length + skip_size) % nums_len
            skip_size += 1
    return nums


def get_dense_hash(sparse_hash: list[int]) -> list[int]:
    return [reduce(lambda acc, curr: acc ^ curr, sparse_hash[i * 16: (i + 1) * 16]) for i in range(16)]


def list_to_hex_str(nums: list[int]) -> str:
    return ''.join([to_hex(num) for num in nums])

    
def to_hex(num: int) -> str:
    return hex(num)[2:].rjust(2, "0")

    

if __name__ == "__main__":
    main()
