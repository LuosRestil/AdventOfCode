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

	bytes, err := os.ReadFile("day14/sample.txt")
	if err != nil {
		panic(err)
	}
	lines := strings.Split(string(bytes), "\n")

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

	inv := map[string]int{}
	produce("FUEL", recipes, inv)
	fmt.Printf("Part 1: %d\n", inv["ORE"])
}

func produce(name string, recipes map[string]recipe, inv map[string]int) {
	fmt.Printf("making %s\n", name)
	if name == "ORE" {
		inv[name]++
	}
	recipe := recipes[name]
	for _, ingredient := range recipe.ingredients {
		for inv[ingredient.name] < ingredient.quantity {
			produce(ingredient.name, recipes, inv)
		}
		inv[ingredient.name] -= ingredient.quantity
	}

}
