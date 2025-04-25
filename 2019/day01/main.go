package main

import (
	"aoc2019/utils"
	"fmt"
	"os"
	"strconv"
	"time"
)

func main() {
	defer utils.TrackTime(time.Now())()

	file, err := os.Open("day01/input.txt")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	lines := utils.GetLines(file)
	masses := make([]int, 0, len(lines))
	for _, line := range lines {
		num, err := strconv.Atoi(line)
		if err != nil {
			panic(err)
		}
		masses = append(masses, num)
	}

	var total int
	for _, mass := range masses {
		total += getFuelReq(mass)
	}
	fmt.Printf("Part 1: %d\n", total)

	total = 0
	for _, mass := range masses {
		total += getFuelReq2(mass)
	}
	fmt.Printf("Part 2: %d\n", total)
}

func getFuelReq(mass int) int {
	return mass/3 - 2
}

func getFuelReq2(mass int) int {
	var total int
	var fuel = getFuelReq(mass)
	for fuel > 0 {
		total += fuel
		fuel = getFuelReq(fuel)
	}
	return total
}
