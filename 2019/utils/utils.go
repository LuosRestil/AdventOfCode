package utils

import (
	"bufio"
	"fmt"
	"os"
)

type Point struct {
	X int
	Y int
}

func GetLines(file *os.File) []string {
	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	return lines
}

func GetNLines(file *os.File, nLines int) []string {
	lines := make([]string, 0, nLines)
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	return lines
}

func Map[T any, U any](src []T, converter func(T) (U, error)) ([]U, error) {
	res := make([]U, 0, len(src))
	for _, val := range src {
		converted, err := converter(val)
		if err != nil {
			return nil, fmt.Errorf("error in MapSlice converter: %w", err)
		}
		res = append(res, converted)
	}
	return res, nil
}

func Filter[T any](src []T, filter func(T) (bool, error)) ([]T, error) {
	var res []T
	for _, val := range src {
		pass, err := filter(val)
		if err != nil {
			return nil, fmt.Errorf("error in FilterSlice filter: %w", err)
		}
		if pass {
			res = append(res, val)
		}
	}
	return res, nil
}

func Reduce[T any, U any](src []T, reducer func(*U, T) error, accumulator U) (U, error) {
	for _, val := range src {
		err := reducer(&accumulator, val)
		if err != nil {
			var zero U
			return zero, fmt.Errorf("error in ReduceSlice reducer: %w", err)
		}
	}
	return accumulator, nil
}

func IntcodeTransform(nums []int) {
	pos := 0
	for {
		opcode := nums[pos]
		if opcode == 99 {
			break
		}
		in1 := nums[nums[pos+1]]
		in2 := nums[nums[pos+2]]
		dest := nums[pos+3]
		if opcode == 1 {
			nums[dest] = in1 + in2
		} else if opcode == 2 {
			nums[dest] = in1 * in2
		}
		pos += 4
	}
}

func Abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func ManhattanDist(p1 Point, p2 Point) int {
	return Abs(p1.X-p2.X) + Abs(p1.Y-p2.Y)
}
