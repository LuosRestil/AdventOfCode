package main

import (
	"aoc2019/intcode"
	"aoc2019/utils"
	"fmt"
	"maps"
	"time"
)

type coord struct {
	x, y int
}

func main() {
	defer utils.TrackTime(time.Now())()

	ic := intcode.GetIntcode("day13/input.txt")
	computer := intcode.NewIntcodeComputer(maps.Clone(ic), &[]int64{}, &[]int64{})
	computer.Run()
	blocks := 0
	for i := 0; i < len(*computer.Outputs); i += 3 {
		if (*computer.Outputs)[i+2] == 2 {
			blocks++
		}
	}
	fmt.Printf("Part 1: %d\n", blocks)

	var _ map[int64]string = map[int64]string{
		0: "⬛️",
		1: "🟫",
		2: "🟨",
		3: "🟦",
		4: "🏐",
	}
	board := make(map[coord]int64)

	ic[0] = 2
	in := []int64{}
	out := []int64{}
	computer = intcode.NewIntcodeComputer(maps.Clone(ic), &in, &out)

	// alter input such that the bottom row is all paddles to auto-run
	// otherwise use controls (pretty difficult)
	var score int64 = 0
	for computer.Step() != intcode.StatusCodeDone {
		if len(*computer.Outputs) == 3 {
			x := (*computer.Outputs)[0]
			y := (*computer.Outputs)[1]
			val := (*computer.Outputs)[2]
			*computer.Outputs = nil
			if x == -1 {
				score = val
			} else {
				board[coord{int(x), int(y)}] = val
			}
		}
		if computer.StatusCode == intcode.StatusCodeAwaitingInput {
			// printGame(board, pieces)
			// fmt.Println(score)
			// var userIn string
			// fmt.Print("input: ")
			// fmt.Scanf("%s", &userIn)
			// nextIn := 0
			// if userIn == "a" {
			// 	nextIn = -1
			// } else if userIn == "d" {
			// 	nextIn = 1
			// }
			// *computer.Inputs = append(*computer.Inputs, int64(nextIn))
			*computer.Inputs = append(*computer.Inputs, 0)
		}
	}
	fmt.Printf("Part 2: %d\n", score)
}

// func printGame(board map[coord]int64, pieces map[int64]string) {
// 	cls()
// 	for y := 0; y <= 20; y++ {
// 		for x := 0; x <= 37; x++ {
// 			val := board[coord{x, y}]
// 			fmt.Printf("%s", pieces[val])
// 		}
// 		fmt.Print("\n")
// 	}
// }

// func cls() {
// 	fmt.Print("\033[H\033[2J")
// }
