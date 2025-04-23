package main

import (
	"aoc2019/intcode"
	"aoc2019/utils"
	"fmt"
	"slices"
	"time"
)

func main() {
	defer utils.TrackTime(time.Now())()

	filepath := "day05/input.txt"
	ic := intcode.GetIntcode(filepath)
	res := intcode.RunWithInputs(slices.Clone(ic[:]), []int64{1})
	fmt.Printf("Part 1: %v\n", res)
	res = intcode.RunWithInputs(slices.Clone(ic[:]), []int64{5})
	fmt.Printf("Part 2: %v\n", res)
}
