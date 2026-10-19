package main

import (
	"aoc2019/utils"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

type ingredient struct {
	quantity int
	name     string
}

type recipe struct {
	quantity    int
	ingredients []ingredient
}

func main() {
	defer utils.TrackTime(time.Now())()

	bytes, err := os.ReadFile("day14/input.txt")
	if err != nil {
		panic(err)
	}
	lines := strings.Split(string(bytes), "\n")
	recipes := recipesFromLines(lines)

	fmt.Printf("Part 1: %d\n", oreRequiredForFuel(1, recipes))
	fmt.Printf("Part 2: %d\n", maxFuelForOre(1_000_000_000_000, recipes))
}

func recipesFromLines(lines []string) map[string]recipe {
	recipes := make(map[string]recipe)
	for _, line := range lines {
		lr := strings.Split(line, " => ")
		l := lr[0]
		r := lr[1]
		ingredients, _ := utils.Map(strings.Split(l, ", "), func(ingStr string) (ingredient, error) {
			quantityAndName := strings.Split(ingStr, " ")
			quantity, err := strconv.Atoi(quantityAndName[0])
			if err != nil {
				panic("oh god oh fuck")
			}
			name := quantityAndName[1]
			return ingredient{quantity, name}, nil
		})
		quantityAndName := strings.Split(r, " ")
		quantity, err := strconv.Atoi(quantityAndName[0])
		if err != nil {
			panic("oh god oh fuck")
		}
		name := quantityAndName[1]
		recipes[name] = recipe{quantity, ingredients}
	}
	return recipes
}

func oreRequiredForFuel(fuelAmount int, recipes map[string]recipe) int {
	inventory := map[string]int{}
	produce("FUEL", fuelAmount, inventory, recipes)
	return inventory["ORE"]
}

func produce(name string, amount int, inventory map[string]int, recipes map[string]recipe) {
	batchSize := recipes[name].quantity
	batches := (amount + batchSize - 1) / batchSize // amount / batchSize, rounded up
	for _, ingredient := range recipes[name].ingredients {
		ingredientAmount := batches * ingredient.quantity
		if ingredient.name == "ORE" {
			inventory[ingredient.name] += ingredientAmount
			continue
		}
		alreadyHas := inventory[ingredient.name]
		if alreadyHas > 0 {
			toUse := min(alreadyHas, ingredientAmount)
			ingredientAmount -= toUse
			inventory[ingredient.name] -= toUse
		}
		produce(ingredient.name, ingredientAmount, inventory, recipes)
	}
	inventory[name] += batchSize*batches - amount
}

func maxFuelForOre(target int, recipes map[string]recipe) int {
	lowerBound := 1
	upperBound := target
	for lowerBound < upperBound {
		middle := (upperBound+lowerBound)/2 + 1
		ore := oreRequiredForFuel(middle, recipes)
		if ore == target {
			return middle
		} else if ore > target {
			upperBound = middle - 1
		} else {
			lowerBound = middle
		}
	}
	return lowerBound
}
