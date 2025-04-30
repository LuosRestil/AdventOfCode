package main

import (
	"aoc2019/intcode"
	"aoc2019/utils"
	"fmt"
	"time"
)

func main() {
	defer utils.TrackTime(time.Now())()

	ic := intcode.GetIntcode("day13/input.txt")
	output := intcode.RunSimple(ic, []int64{}, make(chan int64), make(chan int64), false)
	blocks := 0
	for i := 0; i < len(output); i += 3 {
		if output[i+2] == 2 {
			blocks++
		}
	}
	fmt.Printf("Part 1: %d\n", blocks)

	// pieces := map[int64]string{
	// 	0: "⬛️",
	// 	1: "🟫",
	// 	2: "🟨",
	// 	3: "🟦",
	// 	4: "🏐",
	// }

	ic = intcode.GetIntcode("day13/input.txt")
	ic[0] = 2
	in := make(chan int64, 1)
	out := make(chan int64)
	go func() {
		defer close(out)
		intcode.RunSimple(ic, []int64{}, in, out, true)
	}()

	idx := 0
	var nextIn int64
	for val := range out {
		fmt.Println(idx)
		output[idx] = val
		idx++
		if idx == outlen {
			fmt.Println("round complete")
			idx = 0
			// printGame(output, pieces)
			fmt.Print("enter next input: ")
			fmt.Scanf("%d", &nextIn)
			in <- nextIn
		}
	}
}

func printGame(output []int64, pieces map[int64]string) {
	cls()
	for i := 0; i < len(output); i += 3 {
		x := output[i]
		if x == 0 {
			fmt.Printf("\n")
		}
		fmt.Printf("%s", pieces[output[i+2]])
	}
	fmt.Printf("\n")
}

func cls() {
	fmt.Print("\033[H\033[2J")
}

func setOutputValue(output []int64, x, y int64, val int64) {
	for i := 0; i < len(output); i += 3 {
		outx := output[i]
		outy := output[i+1]
		if x == outx && y == outy {
			output[i+2] = val
			break
		}
	}
}
