package intcode

import (
	"aoc2019/utils"
	"reflect"
	"slices"
	"strconv"
	"testing"
)

func TestParseInstruction(t *testing.T) {
	actual := parseInstruction(1002)
	expected := instructionData{
		opcode: 2,
		modes:  []int{0, 1, 0},
	}
	if !reflect.DeepEqual(actual, expected) {
		t.Errorf("actual %v; expected %v", actual, expected)
	}
}

func TestParseInstruction2(t *testing.T) {
	actual := parseInstruction(1008)
	expected := instructionData{
		opcode: 8,
		modes:  []int{0, 1, 0},
	}
	if !reflect.DeepEqual(actual, expected) {
		t.Errorf("actual %v; expected %v", actual, expected)
	}
}

func TestRunSimple_5_2_1(t *testing.T) {
	ic := map[int64]int64{
		0: 3, 1: 9, 2: 8, 3: 9, 4: 10, 5: 9, 6: 4, 7: 9, 8: 99, 9: -1, 10: 8,
	}
	eq8 := RunSimple(ic, []int64{8}, make(chan int64), make(chan int64))[0]
	if eq8 != 1 {
		t.Errorf("expected 1; actual; %d", eq8)
	}

	ic = map[int64]int64{
		0: 3, 1: 9, 2: 8, 3: 9, 4: 10, 5: 9, 6: 4, 7: 9, 8: 99, 9: -1, 10: 8,
	}
	neq8 := RunSimple(ic, []int64{9}, make(chan int64), make(chan int64))[0]
	if neq8 != 0 {
		t.Errorf("expected 0; actual %d", neq8)
	}
}

func TestRunWithInput_5_2_2(t *testing.T) {
	ic := map[int64]int64{
		0: 3, 1: 3, 2: 1108, 3: -1, 4: 8, 5: 3, 6: 4, 7: 3, 8: 99,
	}
	eq8 := RunSimple(ic, []int64{8}, make(chan int64), make(chan int64))[0]
	if eq8 != 1 {
		t.Errorf("expected 1; actual; %d", eq8)
	}

	ic = map[int64]int64{
		0: 3, 1: 3, 2: 1108, 3: -1, 4: 8, 5: 3, 6: 4, 7: 3, 8: 99,
	}
	neq8 := RunSimple(ic, []int64{9}, make(chan int64), make(chan int64))[0]
	if neq8 != 0 {
		t.Errorf("expected 0; actual %d", neq8)
	}
}

func TestRunWithInput_5_2_3(t *testing.T) {
	ic := map[int64]int64{
		0: 3, 1: 9, 2: 7, 3: 9, 4: 10, 5: 9, 6: 4, 7: 9, 8: 99, 9: -1, 10: 8,
	}
	lt8 := RunSimple(ic, []int64{7}, make(chan int64), make(chan int64))[0]
	if lt8 != 1 {
		t.Errorf("expected 1; actual; %d", lt8)
	}

	ic = map[int64]int64{
		0: 3, 1: 9, 2: 7, 3: 9, 4: 10, 5: 9, 6: 4, 7: 9, 8: 99, 9: -1, 10: 8,
	}
	nlt8 := RunSimple(ic, []int64{9}, make(chan int64), make(chan int64))[0]
	if nlt8 != 0 {
		t.Errorf("expected 0; actual %d", nlt8)
	}
}

func TestRunWithInput_5_2_4(t *testing.T) {
	ic := map[int64]int64{
		0: 3, 1: 3, 2: 1107, 3: -1, 4: 8, 5: 3, 6: 4, 7: 3, 8: 99,
	}
	lt8 := RunSimple(ic, []int64{7}, make(chan int64), make(chan int64))[0]
	if lt8 != 1 {
		t.Errorf("expected 1; actual; %d", lt8)
	}

	ic = map[int64]int64{
		0: 3, 1: 3, 2: 1107, 3: -1, 4: 8, 5: 3, 6: 4, 7: 3, 8: 99,
	}
	nlt8 := RunSimple(ic, []int64{9}, make(chan int64), make(chan int64))[0]
	if nlt8 != 0 {
		t.Errorf("expected 0; actual %d", nlt8)
	}
}

func TestRunSimple_2(t *testing.T) {
	tests := []struct {
		input    map[int64]int64
		expected int64
	}{
		{
			map[int64]int64{0: 1, 1: 9, 2: 10, 3: 3, 4: 2, 5: 3, 6: 11, 7: 0, 8: 99, 9: 30, 10: 40, 11: 50},
			3500,
		},
		{
			map[int64]int64{0: 1, 1: 0, 2: 0, 3: 0, 4: 99},
			2,
		},
		{
			map[int64]int64{0: 2, 1: 3, 2: 0, 3: 3, 4: 99},
			2,
		},
		{
			map[int64]int64{0: 2, 1: 4, 2: 4, 3: 5, 4: 99, 5: 0},
			2,
		},
		{
			map[int64]int64{0: 1, 1: 1, 2: 1, 3: 4, 4: 99, 5: 5, 6: 6, 7: 0, 8: 99},
			30,
		},
	}

	for _, test := range tests {
		RunSimple(test.input, []int64{}, make(chan int64), make(chan int64))
		if test.input[0] != test.expected {
			t.Errorf(
				"actual %d; expected %d",
				test.input[0],
				test.expected,
			)
		}
	}
}

func TestRunSimple_9_1(t *testing.T) {
	in := []int64{109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99}
	expected := slices.Clone(in)
	ic := utils.SliceToMap[int64](in)
	actual := RunSimple(ic, []int64{}, make(chan int64), make(chan int64))
	if !reflect.DeepEqual(actual, expected) {
		t.Errorf("actual %v; expected %v", actual, expected)
	}
}

func TestRunSimple_9_2(t *testing.T) {
	in := []int64{1102, 34915192, 34915192, 7, 4, 7, 99, 0}
	ic := utils.SliceToMap[int64](in)
	actual := RunSimple(ic, []int64{}, make(chan int64), make(chan int64))
	actualStr := strconv.FormatInt(actual[0], 10)
	if len(actualStr) != 16 {
		t.Errorf("actual %s; expected 16 digit number", actualStr)
	}
}

// func TestRunSimple_9_3(t *testing.T) {
func TestRunSimple_9_3(t *testing.T) {
	in := []int64{104, 1125899906842624, 99}
	var expected int64 = 1125899906842624
	ic := utils.SliceToMap[int64](in)
	actual := RunSimple(ic, []int64{}, make(chan int64), make(chan int64))
	if actual[0] != expected {
		t.Errorf("actual %v; expected %v", actual, expected)
	}
}
