package main

import (
	"aoc2019/intcode"
	"aoc2019/utils"
	"fmt"
	"time"
)

func main() {
	defer utils.TrackTime(time.Now())

	ic := intcode.GetIntcode("day07/input.txt")
	phaseSettingPermutations := utils.GetAllPermutations([]int{0, 1, 2, 3, 4})
	
	max := 0
	for _, phaseSettings := range phaseSettingPermutations {
		res := run(ic, phaseSettings)
		if res > max {
			max = res
		}
	}
	fmt.Printf("Part 1: %d\n", max)
}

func run(ic []int, phaseSettings []int) int {
	return 0
}
