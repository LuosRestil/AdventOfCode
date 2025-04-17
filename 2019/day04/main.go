package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	bytes, _ := os.ReadFile("day04/input.txt")
	input := strings.Split(string(bytes), "-")
	low, _ := strconv.Atoi(input[0])
	high, _ := strconv.Atoi(input[1])
	// value between low and high
	// two adjacent digits are the same
	// digits never decrease
	// how many passwords meet criteria?
	p1 := 0
	p2 := 0
	for i := low; i <= high; i++ {
		val := strconv.Itoa(i)
		hasDouble := false
		decreases := false
		hasExclusiveDouble := false
		for j := 0; j < len(val)-1; j++ {
			if val[j] == val[j+1] {
				hasDouble = true
				if (j == 0 || val[j] != val[j-1]) && (j == len(val)-2 || val[j] != val[j+2]) {
					hasExclusiveDouble = true
				}
			}
			if val[j] < val[j+1] {
				decreases = true
			}
		}
		if hasDouble && !decreases {
			p1++
			if hasExclusiveDouble {
				p2++
			}
		}
	}
	fmt.Printf("Part 1: %d\n", p1)
	fmt.Printf("Part 2: %d\n", p2)
}
