package main

import (
	"aoc2019/utils"
	"fmt"
	"math"
	"os"
	"time"
)

var w = 25
var h = 6
var charsInLayer = w * h

func main() {
	defer utils.TrackTime(time.Now())()

	bytes, _ := os.ReadFile("day08/input.txt")
	layers := [][]rune{}
	currentLayer := make([]rune, charsInLayer)
	for i, char := range []rune(string(bytes)) {
		layerIdx := i % charsInLayer
		if layerIdx == 0 && i != 0 {
			layers = append(layers, currentLayer)
			currentLayer = make([]rune, charsInLayer)
		}
		currentLayer[layerIdx] = char
	}

	var winner map[rune]int
	fewestZeroes := math.MaxInt
	for _, layer := range layers {
		counter := make(map[rune]int)
		for _, char := range layer {
			counter[char]++
		}
		if counter['0'] < fewestZeroes {
			fewestZeroes = counter['0']
			winner = counter
		}
	}
	fmt.Printf("Part 1: %d\n", winner['1'] * winner['2'])

	img := layers[(len(layers) - 1)]
	for i := len(layers) - 2; i >= 0; i-- {
		layer := layers[i]
		for j, char := range layer {
			if char == '0' || char == '1' {
				img[j] = char
			}
		}
	}

	fmt.Println("Part 2: 👇")
	printImg(img)
}

func printImg(img []rune) {
	for i, char := range img {
		rowIdx := i % w
		if rowIdx == 0 {
			fmt.Print("\n")
		}
		if char == '1' {
			fmt.Print("⬜️")
		} else {
			fmt.Print("⬛️")
		}
	}
	fmt.Println()
	fmt.Println()
}