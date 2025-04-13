package main

import (
	"aoc2019/utils"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
)

type point = utils.Point

type segment struct {
	start point
	end   point
}

func (s *segment) dist() int {
	return utils.ManhattanDist(s.start, s.end)
}

func (s *segment) vert() bool {
	return s.start.X == s.end.X
}

func main() {
	bytes, err := os.ReadFile("day03/input.txt")
	if err != nil {
		panic(err)
	}
	text := string(bytes)
	lines := strings.Split(text, "\n")
	wire1 := strings.Split(lines[0], ",")
	wire2 := strings.Split(lines[1], ",")
	wire1Segments := getSegments(wire1)
	wire2Segments := getSegments(wire2)

	leastDist := math.MaxInt
	fewestSteps := math.MaxInt
	for i, seg1 := range wire1Segments {
		for j, seg2 := range wire2Segments {
			intersects, pt := getIntersection(seg1, seg2)
			if intersects {
				manhattanDist := utils.ManhattanDist(point{X: 0, Y: 0}, pt)
				if manhattanDist != 0 {
					if manhattanDist < leastDist {
						leastDist = manhattanDist
					}
					steps := getSteps(i, wire1Segments, j, wire2Segments, pt)
					if steps < fewestSteps {
						fewestSteps = steps
					}
				}
			}
		}
	}

	fmt.Printf("Part 1: %d\n", leastDist)
	fmt.Printf("Part 2: %d\n", fewestSteps)
}

func getSteps(idx1 int, segs1 []segment, idx2 int, segs2 []segment, pt point) int {
	total := 0
	for i := range idx1 {
		total += segs1[i].dist()
	}
	total += utils.ManhattanDist(segs1[idx1].start, pt)
	for i := range idx2 {
		total += segs2[i].dist()
	}
	total += utils.ManhattanDist(segs2[idx2].start, pt)
	return total
}

func getSegments(wire []string) []segment {
	start := point{X: 0, Y: 0}
	segments := make([]segment, 0, len(wire))
	for _, instruction := range wire {
		dir := string(instruction[0])
		dist, err := strconv.Atoi(string(instruction[1:]))
		if err != nil {
			panic(err)
		}
		end := point{X: start.X, Y: start.Y}
		if dir == "R" {
			end.X += dist
		} else if dir == "L" {
			end.X -= dist
		} else if dir == "U" {
			end.Y -= dist
		} else if dir == "D" {
			end.Y += dist
		}
		segment := segment{start, end}
		segments = append(segments, segment)
		start = end
	}
	return segments
}

func getIntersection(a segment, b segment) (bool, point) {
	var vert segment
	var horiz segment
	var aVert = a.vert()
	var bVert = b.vert()
	if (aVert && bVert) || (!aVert && !bVert) {
		return false, point{}
	}
	if aVert {
		vert = a
		horiz = b
	} else {
		vert = b
		horiz = a
	}
	horizMinX := horiz.start.X
	horizMaxX := horiz.end.X
	if horizMinX > horizMaxX {
		horizMinX, horizMaxX = horizMaxX, horizMinX
	}

	vertMinY := vert.start.Y
	vertMaxY := vert.end.Y
	if vertMinY > vertMaxY {
		vertMinY, vertMaxY = vertMaxY, vertMinY
	}

	if vert.start.X >= horizMinX &&
		vert.start.X <= horizMaxX &&
		horiz.start.Y >= vertMinY &&
		horiz.start.Y <= vertMaxY {
		return true, point{X: vert.start.X, Y: horiz.start.Y}
	}
	return false, point{}
}
