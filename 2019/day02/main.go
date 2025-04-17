package main

import (
	"aoc2019/utils"
	"fmt"
	"os"
	"slices"
	"strconv"
	"strings"
)

func main() {
	bytes, err := os.ReadFile("day02/input.txt")
	if err != nil {
		panic(err)
	}
	nums, err := utils.Map(
		strings.Split(string(bytes), ","),
		func(val string) (int, error) { return strconv.Atoi(val) })
	if err != nil {
		panic(err)
	}

	cpy := slices.Clone(nums[:])
	cpy[1] = 12
	cpy[2] = 2

	utils.IntcodeTransform(cpy)

	fmt.Printf("Part 1: %d\n", cpy[0])

	target := 19690720
end:
	for i := 0; i <= 99; i++ {
		for j := 0; j <= 99; j++ {
			cpy = slices.Clone(nums[:])
			cpy[1] = i
			cpy[2] = j
			utils.IntcodeTransform(cpy)
			if cpy[0] == target {
				ans := 100*i + j
				fmt.Printf("Part 2: %d\n", ans)
				break end
			}
		}
	}
}
