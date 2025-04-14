package main

import (
	"fmt"
	"os"
	"slices"
	"strings"
	"time"
)

type guard struct {
	pos [2]int
	dir string
}

var nextPosMods = map[string][2]int{
	"^": {-1, 0},
	"v": {1, 0},
	"<": {0, -1},
	">": {0, 1},
}

var turns = map[string]string{
	"^": ">",
	"v": "<",
	"<": "^",
	">": "v",
}

var filepath = "inputs/day06.txt"

func main() {
	start := time.Now()

	path := runPt1()
	keys := make([][2]int, len(path))
	i := 0
	for k := range path {
		keys[i] = k
		i++
	}
	fmt.Printf("Part 1: %d\n", len(keys))

	runPt2(keys)

	elapsed := time.Since(start)
	fmt.Printf("elapsed: %s\n", elapsed)
}

func runPt1() map[[2]int][]string {
	grid := getGrid()
	return solve(grid)
}

func runPt2(trodden [][2]int) {
	grid := getGrid()
	guard := getGuard(grid)
	count := 0
	for _, pos := range(trodden) {
		if pos[0] == guard.pos[0] && pos[1] == guard.pos[1] {
			continue
		}
		grid[pos[0]][pos[1]] = "#"
		completed := solve(grid)
		if completed == nil {
			count++
		}
		grid[pos[0]][pos[1]] = "."
	}
	fmt.Printf("Part 2: %d\n", count)
}

func getGrid() [][]string {
	bytes, err := os.ReadFile(filepath)
	if err != nil {
		panic(err)
	}
	var rows = strings.Split(string(bytes), "\n")
	var grid [][]string
	for _, row := range rows {
		grid = append(grid, strings.Split(row, ""))
	}
	return grid
}

func solve(grid [][]string) map[[2]int][]string {
	guard := getGuard(grid)
	path := map[[2]int][]string {
		{guard.pos[0], guard.pos[1]}: {"^"},
	}
	for isInGrid(grid, guard.pos) {
		if !tick(grid, &guard, path) {
			return nil
		}
	}
	return path
}

func getGuard(grid [][]string) guard {
	for i, row := range grid {
		for j, col := range row {
			if col == "^" {
				return guard{pos: [2]int{i, j}, dir: "^"}
			}
		}
	}
	return guard{}
}

func isInGrid(grid [][]string, pos [2]int) bool {
	return pos[0] >= 0 && pos[0] < len(grid) && pos[1] >= 0 && pos[1] < len(grid[0])
}

func tick(grid [][]string, guard *guard, path map[[2]int][]string) bool {
	move(grid, guard)
	pathKey := [2]int{guard.pos[0], guard.pos[1]}
	val, ok := path[pathKey]
	if ok && slices.Contains(val, guard.dir) {
		return false
	}
	if isInGrid(grid, guard.pos) {
		if !ok {
			path[pathKey] = []string{}
		}
		path[pathKey] = append(path[pathKey], guard.dir)
	}
	return true
}

func move(grid [][]string, guard *guard) {
	nextPosMod := nextPosMods[guard.dir]
	nextPos := [2]int{guard.pos[0] + nextPosMod[0], guard.pos[1] + nextPosMod[1]}
	if isInGrid(grid, nextPos) && grid[nextPos[0]][nextPos[1]] == "#" {
		guard.dir = turns[guard.dir]
	} else {
		guard.pos = nextPos
	}
}
