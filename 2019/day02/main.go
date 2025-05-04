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

	ic := intcode.GetIntcode("day02/input.txt")

	cpy := maps.Clone(ic)
	cpy[1] = 12
	cpy[2] = 2

	computer := intcode.NewIntcodeComputer(cpy, &[]int{}, &[]int{})
	computer.Run()
	fmt.Printf("Part 1: %d\n", computer.Mem[0])

	var target int = 19690720
end:
	for i := 0; i <= 99; i++ {
		for j := 0; j <= 99; j++ {
			cpy = maps.Clone(ic)
			cpy[1] = int(i)
			cpy[2] = int(j)
			computer = intcode.NewIntcodeComputer(cpy, &[]int{}, &[]int{})
			computer.Run()
			if computer.Mem[0] == target {
				ans := 100*i + j
				fmt.Printf("Part 2: %d\n", ans)
				break end
			}
		}
	}
}
