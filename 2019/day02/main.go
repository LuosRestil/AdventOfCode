package main

import (
	"aoc2019/intcode"
	"fmt"
	"slices"
)

func main() {
	ic := intcode.GetIntcode("day02/input.txt")

	cpy := slices.Clone(ic[:])
	cpy[1] = 12
	cpy[2] = 2

	intcode.Run(cpy)

	fmt.Printf("Part 1: %d\n", cpy[0])

	target := 19690720
end:
	for i := 0; i <= 99; i++ {
		for j := 0; j <= 99; j++ {
			cpy = slices.Clone(ic[:])
			cpy[1] = i
			cpy[2] = j
			intcode.Run(cpy)
			if cpy[0] == target {
				ans := 100*i + j
				fmt.Printf("Part 2: %d\n", ans)
				break end
			}
		}
	}
}
