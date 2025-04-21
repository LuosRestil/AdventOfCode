package main

import (
	"aoc2019/intcode"
	"fmt"
	"slices"
	"time"
)

func main() {
	start := time.Now()

	filepath := "day05/input.txt"
	ic := intcode.GetIntcode(filepath)
	res := intcode.RunWithInputs(slices.Clone(ic[:]), []int{1})
	fmt.Printf("Part 1: %v\n", res)
	res = intcode.RunWithInputs(slices.Clone(ic[:]), []int{5})
	fmt.Printf("Part 2: %v\n", res)

	elapsed := time.Since(start)
	fmt.Printf("elapsed: %s\n", elapsed)
}
