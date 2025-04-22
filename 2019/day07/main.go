package main

import (
	"aoc2019/intcode"
	"aoc2019/utils"
	"fmt"
	"slices"
	// "sync"
	"time"
)

func main() {
	defer utils.TrackTime(time.Now())()

	ic := intcode.GetIntcode("day07/input.txt")
	phaseSettingPermutations := utils.GetAllPermutations([]int{0, 1, 2, 3, 4})

	max := 0
	for _, phaseSettings := range phaseSettingPermutations {
		res := run1(ic, phaseSettings)
		if res > max {
			max = res
		}
	}
	fmt.Printf("Part 1: %d\n", max)

	// phaseSettingPermutations = utils.GetAllPermutations([]int{5, 6, 7, 8, 9})

	// wg := sync.WaitGroup()
	// max = 0
	// for _, phaseSettings := range phaseSettingPermutations {
	// 	res := run2(ic, phaseSettings)
	// 	if res > max {
	// 		max = res
	// 	}
	// }
	// fmt.Printf("Part 2: %d\n", max)
}

func run1(ic []int, phaseSettings []int) int {
	ics := make([][]int, len(phaseSettings))
	channels := make([]chan int, len(phaseSettings) + 1)

	for i := range phaseSettings {
		ics[i] = slices.Clone(ic)
		channels[i] = make(chan int)
	}
	channels[len(phaseSettings)] = make(chan int)

	for i := range phaseSettings {
		go intcode.RunWithChannels(ics[i], channels[i], channels[i + 1], i)
	}

	for i, phaseSetting := range phaseSettings {
		channels[i] <- phaseSetting
	}
	channels[0] <- 0

	retVal := <-channels[len(phaseSettings)]
	for _, ch := range channels {
		close(ch)
	}

	return retVal
}

// func run2(ic []int, phaseSettings []int) int {
// 	channels := make([]chan int, len(phaseSettings))
// 	ics := make([][]int, len(phaseSettings))
// 	for i, phaseSetting := range phaseSettings {
// 		ics[i] = slices.Clone(ic)
// 		channels[i] = make(chan int)
// 		channels[i]<-phaseSetting
// 		if i == 0 {
// 			channels[i]<-0
// 		}
// 		go RunWithInputsAndChannels()
// 	}
// 	return 0
// }
