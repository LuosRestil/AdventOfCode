package main

import (
	"aoc2019/utils"
	"fmt"
	"os"
	"strings"
	"time"
)

func main() {
	start := time.Now()

	bytes, err := os.ReadFile("day06/input.txt")
	if err != nil {
		panic("failed to open file")
	}
	rows := strings.Split(string(bytes), "\n")
	system := make(map[string]string)
	graph := make(map[string][]string)
	for _, row := range rows {
		splitRow := strings.Split(row, ")")
		orbitee := splitRow[0]
		orbiter := splitRow[1]
		system[orbiter] = orbitee

		graph[orbiter] = append(graph[orbiter], orbitee)
		graph[orbitee] = append(graph[orbitee], orbiter)
	}
	distances := map[string]int{}
	total := 0
	for orbiter := range system {
		total += distanceToCom(orbiter, system, distances)
	}
	fmt.Printf("Part 1: %d\n", total)

	youPlanet := system["YOU"]
	sanPlanet := system["SAN"]
	fmt.Printf("Part 2: %d\n", bfs(youPlanet, sanPlanet, graph))

	elapsed := time.Since(start)
	fmt.Printf("elapsed: %s\n", elapsed)
}

func distanceToCom(key string, system map[string]string, distances map[string]int) int {
	if key == "COM" {
		return 0
	}
	if val, ok := distances[key]; ok {
		return val
	}
	val := 1 + distanceToCom(system[key], system, distances)
	distances[key] = val
	return val
}

type pair[T, U any] struct {
	a T
	b U
}

func bfs(from string, to string, graph map[string][]string) int {
	queue := []pair[string, int]{{from, 0}}
	seen := utils.NewSet[string]()

	for len(queue) != 0 {
		curr := queue[0]
		name := curr.a
		dist := curr.b
		queue = queue[1:]
		if name == to {
			return dist
		}

		for _, neighbor := range graph[name] {
			if !seen.Has(neighbor) {
				queue = append(queue, pair[string,int]{neighbor, dist + 1})
				seen.Add(neighbor)
			}
		}
	}

	return 0
}
