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
	run(ic, utils.GetAllPermutations([]int{5, 6, 7, 8, 9}), 2)
}

func run(ic []int, phaseSettingPermutations [][]int, part int) {
	var max int
	var mu sync.Mutex
	var wg sync.WaitGroup
	for _, permutation := range phaseSettingPermutations {
		wg.Add(1)
		go func(ps []int) {
			defer wg.Done()
			res := processPermutation(ic, ps, part)
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

func processPermutation(ic []int, phaseSettings []int, part int) int {
	var wg sync.WaitGroup

	ics := make([][]int, len(phaseSettings))
	channels := make([]chan int, len(phaseSettings)+1)

	for i := range phaseSettings {
		ics[i] = slices.Clone(ic)
		channels[i] = make(chan int, 1)
	}
	channels[len(phaseSettings)] = make(chan int)

	for i := range phaseSettings {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			intcode.RunWithChannels(ics[i], channels[i], channels[i+1])
			close(channels[i+1])
		}(i)
	}

	for i, phaseSetting := range phaseSettings {
		channels[i] <- phaseSetting
	}
	channels[0] <- 0

	last := 0
	for v := range channels[len(phaseSettings)] {
		last = v
		channels[0]<-v
	}

	wg.Wait()
	return last
}
