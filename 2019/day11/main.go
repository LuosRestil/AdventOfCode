package main

import (
	"aoc2019/intcode"
	"aoc2019/utils"
	"fmt"
	"maps"
	"math"
	"slices"
	"time"
)

type point = utils.Point

type robot struct {
	pos     point
	heading rune
}

var dirs []rune = []rune{'u', 'r', 'd', 'l'}

func main() {
	defer utils.TrackTime(time.Now())()
	ic := intcode.GetIntcode("day11/input.txt")
	colors := run(ic, 0)
	fmt.Printf("Part 1: %d\n", len(colors))
	colors = run(ic, 1)
	draw(colors)
}

func run(ic map[int64]int64, input int64) map[point]int64 {
	bot := robot{point{X: 0, Y: 0}, 'u'}
	colors := make(map[point]int64)
	computer := intcode.NewIntcodeComputer(maps.Clone(ic), &[]int64{input}, &[]int64{})
	outCount := 0
	lastOutLen := 0
	for computer.Step() != intcode.StatusCodeDone {
		outLen := len(*computer.Outputs)
		if outLen == lastOutLen {
			continue
		}
		lastOutLen = outLen
		val := (*computer.Outputs)[outLen-1]
		if outCount%2 == 0 { // paint, 0 black 1 white
			colors[bot.pos] = val
		} else { // turn, 0 left 1 right, move
			if val == 0 {
				turnLeft(&bot)
			} else {
				turnRight(&bot)
			}
			move(&bot)
			*computer.Inputs = append(*computer.Inputs, colors[bot.pos])
		}
		outCount++
	}
	return colors
}

func turnLeft(bot *robot) {
	dirIdx := slices.Index(dirs, bot.heading)
	nextDirIdx := dirIdx - 1
	if nextDirIdx < 0 {
		nextDirIdx = len(dirs) - 1
	}
	bot.heading = dirs[nextDirIdx]
}

func turnRight(bot *robot) {
	dirIdx := slices.Index(dirs, bot.heading)
	nextDirIdx := dirIdx + 1
	if nextDirIdx == len(dirs) {
		nextDirIdx = 0
	}
	bot.heading = dirs[nextDirIdx]
}

func move(bot *robot) {
	switch bot.heading {
	case 'u':
		bot.pos = point{X: bot.pos.X, Y: bot.pos.Y - 1}
	case 'd':
		bot.pos = point{X: bot.pos.X, Y: bot.pos.Y + 1}
	case 'l':
		bot.pos = point{X: bot.pos.X - 1, Y: bot.pos.Y}
	case 'r':
		bot.pos = point{X: bot.pos.X + 1, Y: bot.pos.Y}
	default:
		panic("invalid heading")
	}
}

func draw(colors map[point]int64) {
	normalizedColors := normalize(colors)
	points := utils.GetKeys(normalizedColors)
	xs, _ := utils.Map(points, func(p point) (int, error) {
		return p.X, nil
	})
	ys, _ := utils.Map(points, func(p point) (int, error) {
		return p.Y, nil
	})
	maxX := slices.Max(xs)
	maxY := slices.Max(ys)

	fmt.Println("Part 2: 👇")
	for i := 0; i <= maxY; i++ {
		for j := 0; j <= maxX; j++ {
			val := normalizedColors[point{X: j, Y: i}]
			if val == 0 {
				fmt.Print("⬛")
			} else {
				fmt.Print("⬜️")
			}
		}
		fmt.Print("\n")
	}
	fmt.Print("\n")
}

func normalize(colors map[point]int64) map[point]int64 {
	minX := math.MaxInt
	minY := math.MaxInt
	for key := range colors {
		if key.X < minX {
			minX = key.X
		}
		if key.Y < minY {
			minY = key.Y
		}
	}
	padX := -minX
	padY := -minY
	res := make(map[point]int64)
	for k, v := range colors {
		res[point{X: k.X + padX, Y: k.Y + padY}] = v
	}
	return res
}
