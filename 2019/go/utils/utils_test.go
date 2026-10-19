package utils

import (
	"reflect"
	"strconv"
	"testing"
)

func TestMap1(t *testing.T) {
	slice := []int{1, 2, 3, 4, 5}
	expected := []int{2, 3, 4, 5, 6}
	actual, err := Map(slice, func(next int) (int, error) {
		return (next + 1), nil
	})
	if err != nil {
		t.Errorf("%v", err)
	}
	if !reflect.DeepEqual(actual, expected) {
		t.Errorf("actual %v; expected %v", actual, expected)
	}
}

func TestMap2(t *testing.T) {
	slice := []string{"1", "2", "3", "4", "5"}
	expected := []int{1, 2, 3, 4, 5}
	actual, err := Map(slice, func(next string) (int, error) {
		converted, err := strconv.Atoi(next)
		if err != nil {
			return 0, err
		}
		return converted, nil
	})
	if err != nil {
		t.Errorf("%v", err)
	}
	if !reflect.DeepEqual(actual, expected) {
		t.Errorf("actual %v; expected %v", actual, expected)
	}
}

func TestFilter1(t *testing.T) {
	slice := []int{8, 6, 7, 5, 3, 0, 9}
	expected := []int{8, 6, 7, 9}
	actual, _ := Filter(slice, func(next int) (bool, error) {
		return next > 5, nil
	})
	if !reflect.DeepEqual(actual, expected) {
		t.Errorf("actual %v; expected %v", actual, expected)
	}
}

func TestFilter2(t *testing.T) {
	slice := []string{"don't", "touch", "that", "dial"}
	expected := []string{"touch", "that"}
	actual, _ := Filter(slice, func(next string) (bool, error) {
		return next[0] == 't', nil
	})
	if !reflect.DeepEqual(actual, expected) {
		t.Errorf("actual %v; expected %v", actual, expected)
	}
}

func TestReduce1(t *testing.T) {
	slice := []int{1, 2, 3, 4, 5}
	expected := 15
	actual, _ := Reduce(slice, func(acc *int, curr int) error {
		*acc += curr
		return nil
	}, 0)
	if actual != expected {
		t.Errorf("actual %d; expected %d", actual, expected)
	}
}

func TestReduce2(t *testing.T) {
	slice := []string{"hi", "how", "are", "you"}
	expected := "hihowareyou"
	actual, _ := Reduce(slice, func(acc *string, curr string) error {
		*acc += curr
		return nil
	}, "")
	if actual != expected {
		t.Errorf("actual %s; expected %s", actual, expected)
	}
}

func TestReduce3(t *testing.T) {
	slice := []string{"a", "a", "a", "a", "b", "b", "c", "d"}
	expected := map[string]int{"a": 4, "b": 2, "c": 1, "d": 1}
	actual, _ := Reduce(slice, func(acc *map[string]int, curr string) error {
		(*acc)[curr]++
		return nil
	}, make(map[string]int))
	if !reflect.DeepEqual(actual, expected) {
		t.Errorf("actual %v; expected %v", actual, expected)
	}
}
