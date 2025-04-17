package main

import (
	"fmt"
	"os"
	"runtime"
	"strings"
	"sync"
	"time"
)

// Direction constants as integers for faster processing
const (
	dirUp    = 0
	dirDown  = 1
	dirLeft  = 2
	dirRight = 3

	wallChar = '#'
	openChar = '.'

	// Direction characters for grid parsing
	upChar    = '^'
	downChar  = 'v'
	leftChar  = '<'
	rightChar = '>'

	// Pre-allocate map sizes
	initialPathMapSize = 5000
)

// Use packed coordinate struct - Similar to Java's Coord class with short values
type Coord struct {
	row, col int16
}

// Use more efficient guard representation with integer direction
type Guard struct {
	row, col int16
	dir      byte
}

// Store direction deltas as a 2D array for direct indexing
var directionDeltas = [4][2]int16{
	{-1, 0}, // UP
	{1, 0},  // DOWN
	{0, -1}, // LEFT
	{0, 1},  // RIGHT
}

// Direction turns at wall using array indexing instead of map
var turnMap = [4]byte{dirRight, dirLeft, dirUp, dirDown} // UP, DOWN, LEFT, RIGHT

var filepath = "../inputs/day06.txt"

// Grid cache to avoid repeated reads
var gridCache [][]byte

func main() {
	start := time.Now()

	// Part 1
	path := runPt1()
	keys := make([]Coord, 0, len(path))
	for k := range path {
		keys = append(keys, k)
	}
	fmt.Printf("Part 1: %d\n", len(keys))

	// Part 2
	runPt2(keys)

	elapsed := time.Since(start)
	fmt.Printf("elapsed: %s\n", elapsed)
}

func runPt1() map[Coord]uint8 {
	grid := getGrid()
	return solve(grid)
}

func runPt2(trodden []Coord) {
	grid := getGrid()
	guard := findGuard(grid)

	// Use 75% of available CPU cores
	numWorkers := max(runtime.NumCPU() * 3 / 4, 1)

	// Create work chunks
	chunkSize := (len(trodden) + numWorkers - 1) / numWorkers

	// Create wait group to synchronize goroutines
	var wg sync.WaitGroup

	// Create atomic counter for thread-safe updates
	var mu sync.Mutex
	count := 0

	// Start workers
	wg.Add(numWorkers)
	for w := range numWorkers {
		// Calculate work range for this worker
		start := w * chunkSize
		end := min(start + chunkSize, len(trodden))

		// Launch goroutine with optimized work assignment
		go func(startIdx, endIdx int) {
			defer wg.Done()

			// Each goroutine gets its own grid copy - pre-allocate
			localGrid := copyGrid(grid)
			localCount := 0

			// Process assigned coordinates
			for _, pos := range trodden[startIdx:endIdx] {
				if pos.row == guard.row && pos.col == guard.col {
					continue
				}

				// Modify local grid
				localGrid[pos.row][pos.col] = wallChar
				completed := solve(localGrid)
				if completed == nil {
					localCount++
				}

				// Restore local grid for next iteration
				localGrid[pos.row][pos.col] = openChar
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

// Fast grid copy operation
func copyGrid(grid [][]byte) [][]byte {
	copy := make([][]byte, len(grid))
	for i := range grid {
		copy[i] = make([]byte, len(grid[i]))
		for j := range grid[i] {
			copy[i][j] = grid[i][j]
		}
	}
	return copy
}

// Optimized grid loading with caching
func getGrid() [][]byte {
	// Return cached grid if available
	if gridCache != nil {
		return copyGrid(gridCache)
	}

	bytes, err := os.ReadFile(filepath)
	if err != nil {
		panic(err)
	}

	// Split by newlines
	rows := strings.Split(strings.TrimSpace(string(bytes)), "\n")

	// Pre-allocate grid slices
	grid := make([][]byte, len(rows))
	for i, row := range rows {
		// Convert string to byte slice for better performance
		grid[i] = []byte(row)
	}

	// Cache the original grid
	gridCache = grid
	return copyGrid(grid)
}

// Use BitSet-like approach with uint8 for direction tracking
func solve(grid [][]byte) map[Coord]uint8 {
	guard := findGuard(grid)

	// Pre-allocate map to avoid rehashing
	path := make(map[Coord]uint8, initialPathMapSize)
	startCoord := Coord{guard.row, guard.col}
	path[startCoord] = 1 << dirUp // Set bit for starting direction

	// Main solve loop
	for isInGrid(grid, guard.row, guard.col) {
		if !tick(grid, &guard, path) {
			return nil
		}
	}
	return path
}

// Optimized guard finder
func findGuard(grid [][]byte) Guard {
	for i := 0; i < len(grid); i++ {
		for j := 0; j < len(grid[i]); j++ {
			if grid[i][j] == upChar {
				return Guard{int16(i), int16(j), dirUp}
			}
		}
	}
	return Guard{}
}

// Inline boundary check
func isInGrid(grid [][]byte, row, col int16) bool {
	return row >= 0 && row < int16(len(grid)) && col >= 0 && col < int16(len(grid[0]))
}

// Use bitsets for direction tracking
func tick(grid [][]byte, guard *Guard, path map[Coord]uint8) bool {
	move(grid, guard)

	// Create coord for map lookup
	pathKey := Coord{guard.row, guard.col}

	// Check if we've been at this position with this direction before
	dirBit := uint8(1 << guard.dir)
	directions, exists := path[pathKey]

	if exists && (directions&dirBit) != 0 {
		return false // Cycle detected
	}

	if isInGrid(grid, guard.row, guard.col) {
		path[pathKey] = directions | dirBit
	}

	return true
}

// Optimized movement with direct array indexing
func move(grid [][]byte, guard *Guard) {
	delta := directionDeltas[guard.dir]
	nextRow := guard.row + delta[0]
	nextCol := guard.col + delta[1]

	if isInGrid(grid, nextRow, nextCol) && grid[nextRow][nextCol] == wallChar {
		// Turn at wall using direct array lookup
		guard.dir = turnMap[guard.dir]
	} else {
		// Move forward
		guard.row = nextRow
		guard.col = nextCol
	}
}
