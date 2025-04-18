package main

import (
	"aoc2019/intcode"
	"fmt"
	"slices"
)

func main() {
	filepath := "day05/input.txt"
	ic := intcode.GetIntcode(filepath)
	res := intcode.RunWithInput(slices.Clone(ic[:]), 1)
	fmt.Printf("Part 1: %v\n", res)
	res = intcode.RunWithInput(slices.Clone(ic[:]), 5)
	fmt.Printf("Part 2: %v\n", res)
}