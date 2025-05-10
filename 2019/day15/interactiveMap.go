package main

import (
	"aoc2019/intcode"
	"aoc2019/utils"
	"fmt"
	"os"
	"slices"
	"time"

	"golang.org/x/term"
)

type loc struct {
	row, col int
}

func interactiveMap() {
	defer utils.TrackTime(time.Now())()

	ic := intcode.GetIntcode("day15/input.txt")
	computer := intcode.NewIntcodeComputer(ic, &[]int{}, &[]int{})

	oldState, _ := term.MakeRaw(int(os.Stdin.Fd()))
	defer term.Restore(int(os.Stdin.Fd()), oldState)
	hideCursor()
	defer restoreCursor()

	curr := loc{}
	grid := map[loc]string{{}: "."}

	for {
		normalizedGrid, normalizedCurr := normalizeGrid(grid, curr)
		printGrid(normalizedGrid, normalizedCurr)
		input := getInput()
		if input == "q" {
			break
		}
		processInput(&computer, input, grid, &curr)
	}
}

func normalizeGrid(grid map[loc]string, curr loc) (map[loc]string, loc) {
	keys := utils.GetKeys(grid)
	rows, _ := utils.Map(keys, func(key loc) (int, error) {
		return key.row, nil
	})
	cols, _ := utils.Map(keys, func(key loc) (int, error) {
		return key.col, nil
	})
	minRow := slices.Min(rows)
	minCol := slices.Min(cols)
	rowOffset := min(minRow, 0)
	colOffset := min(minCol, 0)
	normalizedGrid := map[loc]string{}
	for k, v := range grid {
		normalizedGrid[loc{k.row - rowOffset, k.col - colOffset}] = v
	}
	normalizedCurr := loc{curr.row - rowOffset, curr.col - colOffset}
	return normalizedGrid, normalizedCurr
}

func printGrid(grid map[loc]string, curr loc) {
	charmap := map[string]string {
		" ": "⬛️",
		".": "🟨",
		"#": "🟫",
		"!": "⚡️",
		"@": "🤖",
	}
	cls()
	// fmt.Printf("%v, %v\n\r", grid, curr)
	keys := utils.GetKeys(grid)
	rows, _ := utils.Map(keys, func(key loc) (int, error) {
		return key.row, nil
	})
	cols, _ := utils.Map(keys, func(key loc) (int, error) {
		return key.col, nil
	})
	maxRow := slices.Max(rows)
	maxCol := slices.Max(cols)
	for row := 0; row <= maxRow; row++ {
		for col := 0; col <= maxCol; col++ {
			char := " "
			if val, ok := grid[loc{row, col}]; ok {
				char = val
			}
			if row == curr.row && col == curr.col && char != "!" {
				char = "@"
			}
			fmt.Print(charmap[char])
		}
		fmt.Print("\n\r")
	}
}

func getInput() string {
	b := make([]byte, 3)
	n, _ := os.Stdin.Read(b)
	if b[0] == 0x1b && n == 3 {
		if b[1] != '[' {
			return ""
		}
		switch {
		case b[2] == 'A':
			return "north"
		case b[2] == 'B':
			return "south"
		case b[2] == 'C':
			return "east"
		case b[2] == 'D':
			return "west"
		}
	}

	if b[0] == 'q' {
		return "q"
	}

	return ""
}

func processInput(computer *intcode.IntcodeComputer, input string, grid map[loc]string, curr *loc) {
	inputToInstruction := map[string]int{
		"north": 1,
		"south": 2,
		"west":  3,
		"east":  4,
	}
	inputInstruction := inputToInstruction[input]
	computer.AddInput(inputInstruction)
	for computer.Step() != intcode.StatusCodeAwaitingInput {
	}
	output, ok := computer.LastOutput()
	if !ok {
		panic("oh god oh fuck")
	}
	computer.ClearOutputs()
	updateGrid(grid, input, output, curr)
}

func updateGrid(grid map[loc]string, input string, statusCode int, curr *loc) {
	target := *curr
	switch input {
	case "north":
		target.row--
	case "south":
		target.row++
	case "west":
		target.col--
	case "east":
		target.col++
	}

	switch statusCode {
	case 0:
		grid[target] = "#"
	case 1:
		grid[target] = "."
	case 2:
		grid[target] = "!"
	}

	if statusCode != 0 {
		*curr = target
	}
	// fmt.Print("after update\n\r")
	// fmt.Printf("%v, %s, %d, %v\n\r", grid, input, statusCode, curr)
}

func hideCursor() {
	fmt.Print("\033[?25l")
}

func restoreCursor() {
	fmt.Print("\033[?25h")
}

func cls() {
	fmt.Print("\033[2J\033[H")
}