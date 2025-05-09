package main

import (
	"aoc2019/intcode"
	"aoc2019/utils"
	"fmt"
	"maps"
	"time"
)

func main() {
	defer utils.TrackTime(time.Now())()

	filepath := "day05/input.txt"
	ic := intcode.GetIntcode(filepath)
	computer := intcode.NewIntcodeComputer(maps.Clone(ic), &[]int{1}, &[]int{})
	computer.Run()
	fmt.Printf("Part 1: %v\n", *computer.Outputs)
	computer = intcode.NewIntcodeComputer(maps.Clone(ic), &[]int{5}, &[]int{})
	computer.Run()
	fmt.Printf("Part 2: %v\n", *computer.Outputs)
}
