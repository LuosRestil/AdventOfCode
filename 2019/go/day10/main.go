package main

import (
	"aoc2019/utils"
	"fmt"
	"math"
	"os"
	"slices"
	"strings"
	"time"
)

type coord struct {
	x, y int
}

type asteroid struct {
	loc   coord
	angle float64
	dist  float64
}

func main() {
	defer utils.TrackTime(time.Now())()

	bytes, err := os.ReadFile("day10/input.txt")
	if err != nil {
		panic("failed to read file")
	}
	grid := strings.Split(string(bytes), "\n")
	locs := make(map[coord]int)
	for row := range grid {
		for col := range grid[0] {
			char := grid[row][col]
			if char == '#' {
				locs[coord{col, row}] = 0
			}
		}
	}

	maxVisible := 0
	var bestLocAsteroids []asteroid
	var bestLocAngles []float64
	for a := range locs {
		asteroids := []asteroid{}
		for b := range locs {
			if a == b {
				continue
			}
			xDiff := float64(b.x - a.x)
			yDiff := float64(b.y - a.y)
			// swap typical x,y args so zero is up and values increase clockwise
			angle := math.Atan2(xDiff, -yDiff)
			// normalize to 0..2pi
			if angle < 0 {
				angle += 2 * math.Pi
			}
			dist := math.Sqrt(xDiff*xDiff + yDiff*yDiff)
			asteroids = append(asteroids, asteroid{b, angle, dist})
		}
		visibles := getUniqueAsteroidAngles(asteroids)
		if len(visibles) > maxVisible {
			maxVisible = len(visibles)
			bestLocAsteroids = asteroids
			bestLocAngles = visibles
		}
	}
	fmt.Printf("Part 1: %d\n", maxVisible)

	slices.Sort(bestLocAngles)
	asteroidsMap := make(map[float64][]asteroid)
	for _, angle := range bestLocAngles {
		asteroidsMap[angle] = []asteroid{}
	}
	for _, asteroid := range bestLocAsteroids {
		asteroidsMap[asteroid.angle] = append(asteroidsMap[asteroid.angle], asteroid)
	}
	for _, asteroidList := range asteroidsMap {
		slices.SortFunc(asteroidList, func(a asteroid, b asteroid) int {
			if a.dist < b.dist {
				return -1
			}
			return 1
		})
	}
	zapCount := 0
	var last asteroid
	i := 0
	for zapCount < 200 {
		angle := bestLocAngles[i]
		asteroidList := asteroidsMap[angle]
		if len(asteroidList) > 0 {
			last = asteroidList[0]
			asteroidsMap[angle] = asteroidList[1:]
			zapCount++
		}
		i++
		i %= len(bestLocAngles)
	}
	fmt.Printf("Part 2: %d\n", last.loc.x * 100 + last.loc.y)
}

func getUniqueAsteroidAngles(asteroids []asteroid) []float64 {
	asteroidAngles, _ := utils.Map(asteroids, func(a asteroid) (float64, error) {
		return a.angle, nil
	})
	uniqueAnglesSet := utils.SliceToSet(asteroidAngles)
	return utils.GetKeys(uniqueAnglesSet)
}
