package main

import (
	"fmt"
	"os"
	"runtime"
	"slices"
	"strings"
	"sync"
	"time"
)

// Direction constants for faster lookup
const (
	dirUp    = "^"
	dirDown  = "v"
	dirLeft  = "<"
	dirRight = ">"
	wallChar = "#"
	openChar = "."
)

// Pre-allocate map sizes
const (
	initialPathMapSize = 5000
)

type guard struct {
	pos [2]int
	dir string
}

// Pre-initialized maps for faster lookup
var nextPosMods = map[string][2]int{
	dirUp:    {-1, 0},
	dirDown:  {1, 0},
	dirLeft:  {0, -1},
	dirRight: {0, 1},
}

var turns = map[string]string{
	dirUp:    dirRight,
	dirDown:  dirLeft,
	dirLeft:  dirUp,
	dirRight: dirDown,
}

var filepath = "inputs/day06.txt"

func main() {
	start := time.Now()

	// Part 1
	path := runPt1()
	keys := make([][2]int, 0, len(path))
	for k := range path {
		keys = append(keys, k)
	}
	fmt.Printf("Part 1: %d\n", len(keys))

	// Part 2
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

	// Use 75% of available CPU cores (similar to C++ version)
	numWorkers := runtime.NumCPU() * 3 / 4
	if numWorkers < 1 {
		numWorkers = 1
	}

	// Create work chunks
	chunkSize := (len(trodden) + numWorkers - 1) / numWorkers

	// Create wait group to synchronize goroutines
	var wg sync.WaitGroup

	// Create mutex for thread-safe counter updates
	var mu sync.Mutex
	count := 0

	// Pre-allocate slice for goroutines
	wg.Add(numWorkers)

	// Start workers
	for w := 0; w < numWorkers; w++ {
		// Calculate work range for this worker
		start := w * chunkSize
		end := start + chunkSize
		if end > len(trodden) {
			end = len(trodden)
		}

		// Launch goroutine
		go func(startIdx, endIdx int) {
			defer wg.Done()

			// Each goroutine gets its own grid copy - pre-allocate
			localGrid := make([][]string, len(grid))
			for i := range grid {
				localGrid[i] = make([]string, len(grid[i]))
				copy(localGrid[i], grid[i])
			}

			localCount := 0

			// Process assigned coordinates
			for _, pos := range trodden[startIdx:endIdx] {
				if pos[0] == guard.pos[0] && pos[1] == guard.pos[1] {
					continue
				}

				// Modify local grid
				localGrid[pos[0]][pos[1]] = wallChar
				completed := solve(localGrid)
				if completed == nil {
					localCount++
				}

				// Restore local grid for next iteration
				localGrid[pos[0]][pos[1]] = openChar
			}

			// Safely update global counter
			mu.Lock()
			count += localCount
			mu.Unlock()
		}(start, end)
	}

	// Wait for all workers to complete
	wg.Wait()

	fmt.Printf("Part 2: %d\n", count)
}

// Optimized grid loading
func getGrid() [][]string {
	bytes, err := os.ReadFile(filepath)
	if err != nil {
		panic(err)
	}

	// Split by newlines
	rows := strings.Split(strings.TrimSpace(string(bytes)), "\n")

	// Pre-allocate grid slices for better performance
	grid := make([][]string, len(rows))
	for i, row := range rows {
		// Pre-allocate row and transform to string slice in one operation
		grid[i] = strings.Split(row, "")
	}
	return grid
}

func solve(grid [][]string) map[[2]int][]string {
	guard := getGuard(grid)

	// Pre-allocate map to avoid rehashing
	path := make(map[[2]int][]string, initialPathMapSize)
	path[guard.pos] = []string{dirUp}

	for isInGrid(grid, guard.pos) {
		if !tick(grid, &guard, path) {
			return nil
		}
	}
	return path
}

// Fast guard finder
func getGuard(grid [][]string) guard {
	for i, row := range grid {
		for j, cell := range row {
			if cell == dirUp {
				return guard{pos: [2]int{i, j}, dir: dirUp}
			}
		}
	}
	return guard{}
}

// Inlined boundary check for better performance
func isInGrid(grid [][]string, pos [2]int) bool {
	return pos[0] >= 0 && pos[0] < len(grid) && pos[1] >= 0 && pos[1] < len(grid[0])
}

func tick(grid [][]string, guard *guard, path map[[2]int][]string) bool {
	move(grid, guard)
	pathKey := guard.pos

	// Check if we've been at this position with this direction before
	val, ok := path[pathKey]
	if ok && slices.Contains(val, guard.dir) {
		return false
	}

	if isInGrid(grid, guard.pos) {
		if !ok {
			// Pre-allocate slice with capacity
			path[pathKey] = make([]string, 0, 4)
		}
		path[pathKey] = append(path[pathKey], guard.dir)
	}
	return true
}

func move(grid [][]string, guard *guard) {
	nextPosMod := nextPosMods[guard.dir]
	nextPos := [2]int{guard.pos[0] + nextPosMod[0], guard.pos[1] + nextPosMod[1]}

	if isInGrid(grid, nextPos) && grid[nextPos[0]][nextPos[1]] == wallChar {
		guard.dir = turns[guard.dir]
	} else {
		guard.pos = nextPos
	}
}
