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
	ic := intcode.GetIntcode("day07/input.txt")
	run(ic, utils.GetAllPermutations([]int{0, 1, 2, 3, 4}), 1)
	run(ic, utils.GetAllPermutations([]int{5, 6, 7, 8, 9}), 2)
}

func run(ic map[int64]int64, phaseSettingPermutations [][]int, part int) {
	var max int64
	for _, permutation := range phaseSettingPermutations {
		res := processPermutation(ic, permutation)
		if res > max {
			max = res
		}
	}
	fmt.Printf("Part %d: %d\n", part, max)
}

func processPermutation(ic map[int64]int64, phaseSettings []int) int64 {
	ics := make([]map[int64]int64, len(phaseSettings))
	io := make([][]int64, len(phaseSettings))
	computers := make([]intcode.IntcodeComputer, len(phaseSettings))

	for i, phaseSetting := range phaseSettings {
		ics[i] = maps.Clone(ic)
		io[i] = []int64{int64(phaseSetting)}
	}
	for i := range phaseSettings {
		computers[i] = intcode.NewIntcodeComputer(ics[i], &io[i], &io[(i+1)%len(phaseSettings)])
	}
	*computers[0].Inputs = append((*computers[0].Inputs), 0)

	lastComp := &computers[len(phaseSettings)-1]
	for lastComp.StatusCode != intcode.StatusCodeDone {
		for i := range computers {
			c := &computers[i]
			for c.Step() == intcode.StatusCodeOk {
			}
		}
	}

	return (*lastComp.Outputs)[len(*lastComp.Outputs)-1]
}
