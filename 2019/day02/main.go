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

	ic := intcode.GetIntcode("day02/input.txt")

	cpy := slices.Clone(ic[:])
	cpy[1] = 12
	cpy[2] = 2

	intcode.Run(cpy)

	fmt.Printf("Part 1: %d\n", cpy[0])

	var target int64 = 19690720
end:
	for i := 0; i <= 99; i++ {
		for j := 0; j <= 99; j++ {
			cpy = slices.Clone(ic[:])
			cpy[1] = int64(i)
			cpy[2] = int64(j)
			intcode.Run(cpy)
			if cpy[0] == target {
				ans := 100*i + j
				fmt.Printf("Part 2: %d\n", ans)
				break end
			}
		}
	}
}
