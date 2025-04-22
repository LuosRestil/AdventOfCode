package main

import (
	"aoc2019/intcode"
	"aoc2019/utils"
	"fmt"
	"slices"
	"sync"
	"time"
)

func main() {
	defer utils.TrackTime(time.Now())()
	ic := intcode.GetIntcode("day07/input.txt")
	run(ic, utils.GetAllPermutations([]int{0, 1, 2, 3, 4}), 1)
}

func run(ic []int, phaseSettingPermutations [][]int, part int) {
	var max int
	var mu sync.Mutex
	var wg sync.WaitGroup
	for _, permutation := range phaseSettingPermutations {
		wg.Add(1)
		go func(ps []int) {
			defer wg.Done()
			res := processPermutation(ic, permutation)
			mu.Lock()
			if res > max {
				max = res
			}
			mu.Unlock()
		}(permutation)
	}
	wg.Wait()
	fmt.Printf("Part %d: %d\n", part, max)
}

func processPermutation(ic []int, phaseSettings []int) int {
	var wg sync.WaitGroup

	ics := make([][]int, len(phaseSettings))
	channels := make([]chan int, len(phaseSettings)+1)

	for i := range phaseSettings {
		ics[i] = slices.Clone(ic)
		channels[i] = make(chan int)
	}
	channels[len(phaseSettings)] = make(chan int)

	for i := range phaseSettings {
		wg.Add(1)
		if i == len(phaseSettings) - 1 {
			wg.Add(1)
		}
		go func(i int) {
			defer wg.Done()
			intcode.RunWithChannels(ics[i], channels[i], channels[i + 1])
		}(i)
	}

	for i, phaseSetting := range phaseSettings {
		channels[i] <- phaseSetting
	}
	channels[0] <- 0

	go func() {
		wg.Wait()
		for _, ch := range channels {
			close(ch)
		}
	}()

	outChanIdx := len(channels) - 1
	retVal := <-channels[outChanIdx]

	return retVal
}
