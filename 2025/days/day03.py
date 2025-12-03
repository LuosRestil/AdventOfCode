from pathlib import Path

def get_largest_possible_number(bank: str, digits: int) -> str:
    if digits == 0: return ""
    leading_digit = max(bank[:len(bank) - (digits - 1)])
    idx = bank.index(leading_digit)
    return leading_digit + get_largest_possible_number(bank[idx+1:], digits - 1)

banks = Path("inputs/day03.txt").read_text().splitlines()
print(f"Part 1: {sum(int(get_largest_possible_number(bank, 2)) for bank in banks)}")
print(f"Part 2: {sum(int(get_largest_possible_number(bank, 12)) for bank in banks)}")