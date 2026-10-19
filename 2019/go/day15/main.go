package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	// pt 1
	// interactiveMap()

	// pt 2
	file, _ := os.ReadFile("day15/map.txt")
	lines := strings.Split(string(file), "\n")
	grid := make([][]rune, len(lines))
	for i, line := range lines {
		grid[i] = []rune(line)
	}
	iters := 0
	oxychar := '🟦'
	pathchar := '🟨'
	iterate := true
	for iterate {
		iterate = false
		iters++
		cpy := make([][]rune, len(grid))
		for i := range grid {
			cpy[i] = make([]rune, len(grid[i]))
			copy(cpy[i], grid[i])
		}
		for i := 1; i < len(grid)-1; i++ {
			for j := 1; j < len(grid[0])-1; j++ {
				if grid[i][j] == pathchar {
					iterate = true
					if grid[i-1][j] == oxychar ||
						grid[i+1][j] == oxychar ||
						grid[i][j-1] == oxychar ||
						grid[i][j+1] == oxychar {
						cpy[i][j] = oxychar
					}
				}

			}
		}
		grid = cpy
		// displayGrid(grid)
	}
	fmt.Printf("Part 2: %d\n", iters-1)
}
