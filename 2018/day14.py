import time

def main():
    input_str = "640441"
    target = int(input_str)
    input_digits = [int(digit) for digit in list(input_str)]

    idx_1 = 0
    idx_2 = 1
    recipes = [3, 7]

    while len(recipes) < target + 10:
        create_new_recipes(recipes, recipes[idx_1], recipes[idx_2], input_digits)
        new_idxs = move_elves(recipes, idx_1, idx_2)
        idx_1 = new_idxs[0]
        idx_2 = new_idxs[1]
    print(f"Part 1: {''.join([str(elem) for elem in recipes[target:target+10]])}")
    
    while True:
        match = create_new_recipes(recipes, recipes[idx_1], recipes[idx_2], input_digits)
        if match:
            print(f"Part 2: {len(recipes) - len(input_digits)}")
            break
        new_idxs = move_elves(recipes, idx_1, idx_2)
        idx_1 = new_idxs[0]
        idx_2 = new_idxs[1]

def create_new_recipes(recipes, score_1, score_2, input_digits):
    sum = score_1 + score_2
    if sum < 10:
        recipes.append(sum)
        if recipes_end_with_input(recipes, input_digits):
            return True
    else:
        recipes.append(1)
        if recipes_end_with_input(recipes, input_digits):
            return True
        recipes.append(sum - 10)
        if recipes_end_with_input(recipes, input_digits):
            return True
    return False

def move_elves(recipes, idx_1, idx_2):
    return (
        (idx_1 + recipes[idx_1] + 1) % len(recipes),
        (idx_2 + recipes[idx_2] + 1) % len(recipes)
    )

def recipes_end_with_input(recipes, input_digits):
    if len(recipes) < len(input_digits): return False
    for i in range(0, len(input_digits)):
        if recipes[-len(input_digits) + i] != input_digits[i]:
            return False
    return True

if __name__ == "__main__":
    start_time = time.time()
    main()
    print("--- %s seconds ---" % (time.time() - start_time))
