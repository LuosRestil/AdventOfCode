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
	res := intcode.RunSimple(maps.Clone(ic), []int64{1}, make(chan int64), make(chan int64))
	fmt.Printf("Part 1: %v\n", res)
	res = intcode.RunSimple(maps.Clone(ic), []int64{5}, make(chan int64), make(chan int64))
	fmt.Printf("Part 2: %v\n", res)
}
