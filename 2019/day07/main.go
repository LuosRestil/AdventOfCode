package main

import (
	"aoc2019/intcode"
	"aoc2019/utils"
	"fmt"
	"maps"
	"sync"
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
	var mu sync.Mutex
	var wg sync.WaitGroup
	for _, permutation := range phaseSettingPermutations {
		wg.Add(1)
		go func(ps []int) {
			defer wg.Done()
			res := processPermutation(ic, ps)
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

func processPermutation(ic map[int64]int64, phaseSettings []int) int64 {
	var wg sync.WaitGroup

	ics := make([]map[int64]int64, len(phaseSettings))
	channels := make([]chan int64, len(phaseSettings)+1)

	for i := range phaseSettings {
		ics[i] = maps.Clone(ic)
		channels[i] = make(chan int64, 1)
	}
	channels[len(phaseSettings)] = make(chan int64)

	for i := range phaseSettings {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			intcode.Run(ics[i], channels[i], channels[i+1])
			close(channels[i+1])
		}(i)
	}

	for i, phaseSetting := range phaseSettings {
		channels[i] <- int64(phaseSetting)
	}
	channels[0] <- 0

	var last int64 = 0
	for v := range channels[len(phaseSettings)] {
		last = v
		channels[0] <- v
	}

	wg.Wait()
	return last
}
