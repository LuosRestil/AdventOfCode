package utils

import (
	"bufio"
	"fmt"
	"os"
	"time"
	"slices"
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

func Abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func ManhattanDist(p1 Point, p2 Point) int {
	return Abs(p1.X-p2.X) + Abs(p1.Y-p2.Y)
}

type Set[T comparable] struct {
	members map[T]struct{}
}

func (s *Set[T]) Add(key T) {
	s.members[key] = struct{}{}
}

func (s *Set[T]) Has(key T) bool {
	_, ok := s.members[key]; return ok;
}

func (s *Set[T]) Remove(key T) {
	delete(s.members, key)
}

func (s *Set[T]) Size(key T) int {
	return len(s.members)
}

func (s *Set[T]) Union(s2 *Set[T]) *Set[T] {
	res := NewSet[T]()
	for key := range s.members {
		res.Add(key)
	}
	for key := range s2.members {
		res.Add(key)
	}
	return res
}

func (s *Set[T]) Intersection(s2 *Set[T]) *Set[T] {
	res := NewSet[T]()
	for key := range s.members {
		if s2.Has(key) {
			res.Add(key)
		}
	}
	return res
}

// Returns the subset from s, that doesn't exist in s2 (param)
func (s *Set[T]) Difference(s2 *Set[T]) *Set[T] {
	res := NewSet[T]()
	for key := range s.members {
		if !s2.Has(key) {
			res.Add(key)
		}
	}
	return res
}

func (s *Set[T]) ToSlice() []T {
	res := []T{}
	for key := range s.members {
		res = append(res, key)
	}
	return res
}

func NewSet[T comparable]() *Set[T] {
	return &Set[T]{make(map[T]struct{})}
}

func GetAllPermutations[T any](list []T) [][]T {
	if len(list) == 1 {
		return [][]T{list}
	}

	perms := [][]T{}
	for i := range list {
		curr := list[i]
		others := slices.Concat(slices.Clone(list[0:i]), slices.Clone(list[i+1:]))
		remaining := GetAllPermutations(others)		
		for _, perm := range remaining {
			perms = append(perms, append([]T{curr}, perm...))
		}
	}
	return perms
}

func TrackTime(start time.Time) func() {
	return func() {
		fmt.Printf("elapsed: %s\n", time.Since(start))
	}
}

type IntConstraint interface {
	int | int8 | int16 | int32 | int64
}

// Turns a slice into a map having keys equal to the slice's indices
func SliceToMap[T IntConstraint, U any](s []U) map[T]U {
	m := make(map[T]U)
	for i, v := range s {
		m[T(i)] = v
	}
	return m
}

func SliceToSet[T comparable](s []T) map[T]struct{} {
	m := make(map[T]struct{})
	for _, v := range s {
		m[v] = struct{}{}
	}
	return m
}

func GetKeys[T comparable, U any](m map[T]U) []T {
	res := make([]T, 0, len(m))
	for k := range m {
		res = append(res, k)
	}
	return res
}

func GCD(a int64, b int64) int64 {
	for b > 0 {
		a, b = b, a % b
	}
	return a
}

func LCM(a int64, b int64) int64 {
	return (a * b) / GCD(a, b)
}

type Queue[T any] struct {
	content []T
}

func NewQueue[T any]() Queue[T] {
	return Queue[T]{
		content: []T{},
	}
}

func (q *Queue[T]) Add(val T) {
	q.content = append(q.content, val)
}

func (q *Queue[T]) PopFront() T {
	val := q.content[0]
	q.content = q.content[1:]
	return val
}

func (q *Queue[T]) PopEnd() T {
	val := q.content[len(q.content) - 1]
	q.content = q.content[:len(q.content)-1]
	return val
}

func (q *Queue[T]) Size() int {
	return len(q.content)
}