package main

import (
	"aoc2019/utils"
	"fmt"
	"os"
	"slices"
	"strconv"
	"strings"
	"time"
)

type vec3 struct {
	x, y, z int
}

type moon struct {
	pos vec3
	vel vec3
}

func main() {
	defer utils.TrackTime(time.Now())()

	bytes, err := os.ReadFile("day12/input.txt")
	if err != nil {
		panic("failed to read file")
	}
	lines := strings.Split(string(bytes), "\n")
	moons := getMoons(lines)

	steps := 1000
	for range steps {
		step(moons)
	}
	energy := calculateEnergy(moons)
	fmt.Printf("Part 1: %d\n", energy)

	// find loop size for x, y, and z separately and get lcm
	moons = getMoons(lines)
	origXs := getXs(moons)
	xLoopSize := 0
	for xLoopSize == 0 || !match(getXs(moons), origXs) {
		step(moons)
		xLoopSize++
	}
	moons = getMoons(lines)
	origYs := getYs(moons)
	yLoopSize := 0
	for yLoopSize == 0 || !match(getYs(moons), origYs) {
		step(moons)
		yLoopSize++
	}
	moons = getMoons(lines)
	origZs := getZs(moons)
	zLoopSize := 0
	for zLoopSize == 0 || !match(getZs(moons), origZs) {
		step(moons)
		zLoopSize++
	}
	ans, _ := utils.Reduce([]int64{int64(xLoopSize), int64(yLoopSize), int64(zLoopSize)}, func (acc *int64, curr int64) error {
		*acc = utils.LCM(*acc, curr)
		return nil
	}, 1)
	fmt.Printf("Part 2: %d\n", ans)
}

func match(a []int, b []int) bool {
	return slices.Equal(a, b)
}

func getMoons(lines []string) []moon {
	moons := make([]moon, len(lines))
	stripped, _ := utils.Map(lines, func(line string) (string, error) {
		return line[1 : len(line)-1], nil
	})
	for i, line := range stripped {
		parts := strings.Split(line, ", ")
		x, _ := strconv.Atoi(strings.Split(parts[0], "=")[1])
		y, _ := strconv.Atoi(strings.Split(parts[1], "=")[1])
		z, _ := strconv.Atoi(strings.Split(parts[2], "=")[1])
		moons[i] = moon{vel: vec3{0, 0, 0}, pos: vec3{x, y, z}}
	}
	return moons
}

func step(moons []moon) {
	// update velocity of each moon by applying gravity
	// consider each pair of moons
	for i := range len(moons) - 1 {
		for j := i + 1; j < len(moons); j++ {
			// for each axis, vel of each moon changes by 1 to pull them together
			a := &moons[i]
			b := &moons[j]
			// x
			if a.pos.x != b.pos.x {
				var less, more *moon
				if a.pos.x < b.pos.x {
					less = a
					more = b
				} else {
					less = b
					more = a
				}
				less.vel.x += 1
				more.vel.x -= 1
			}
			// y
			if a.pos.y != b.pos.y {
				var less, more *moon
				if a.pos.y < b.pos.y {
					less = a
					more = b
				} else {
					less = b
					more = a
				}
				less.vel.y += 1
				more.vel.y -= 1
			}
			// z
			if a.pos.z != b.pos.z {
				var less, more *moon
				if a.pos.z < b.pos.z {
					less = a
					more = b
				} else {
					less = b
					more = a
				}
				less.vel.z += 1
				more.vel.z -= 1
			}
		}
	}
	// update the position of each moon by applying velocity
	for i := range moons {
		moons[i].pos.x += moons[i].vel.x
		moons[i].pos.y += moons[i].vel.y
		moons[i].pos.z += moons[i].vel.z
	}
}

func printMoons(moons []moon) {
	for _, moon := range moons {
		fmt.Printf("%+v\n", moon)
	}
}

func calculateEnergy(moons []moon) int {
	total := 0
	for _, moon := range moons {
		// potential energy, sum of abs of pos coords
		potential := utils.Abs(moon.pos.x) + utils.Abs(moon.pos.y) + utils.Abs(moon.pos.z)
		// kinetic energy sum of abs of vel coords
		kinetic := utils.Abs(moon.vel.x) + utils.Abs(moon.vel.y) + utils.Abs(moon.vel.z)
		total += potential * kinetic
	}
	return total
}

func getXs(moons []moon) []int {
	res := make([]int, len(moons) * 2)
	for i, moon := range moons {
		res[i] = moon.pos.x
		res[i+1]=moon.vel.x
	}
	return res
}

func getYs(moons []moon) []int {
	res := make([]int, len(moons) * 2)
	for i, moon := range moons {
		res[i] = moon.pos.y
		res[i+1]=moon.vel.y
	}
	return res
}

func getZs(moons []moon) []int {
	res := make([]int, len(moons) * 2)
	for i, moon := range moons {
		res[i] = moon.pos.z
		res[i+1]=moon.vel.z
	}
	return res
}