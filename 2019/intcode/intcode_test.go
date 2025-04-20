package intcode

import (
	"reflect"
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

func TestRunWithInput_5_2_1(t *testing.T) {
	ic := []int{3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8}
	eq8 := RunWithInput(ic, 8)[0]
	if eq8 != 1 {
		t.Errorf("expected 1; actual; %d", eq8)
	}
	neq8 := RunWithInput(ic, 9)[0]
	if neq8 != 0 {
		t.Errorf("expected 0; actual %d", neq8)
	}
}

func TestRunWithInput_5_2_2(t *testing.T) {
	ic := []int{3, 3, 1108, -1, 8, 3, 4, 3, 99}
	eq8 := RunWithInput(ic, 8)[0]
	if eq8 != 1 {
		t.Errorf("expected 1; actual; %d", eq8)
	}
	neq8 := RunWithInput(ic, 9)[0]
	if neq8 != 0 {
		t.Errorf("expected 0; actual %d", neq8)
	}
}

func TestRunWithInput_5_2_3(t *testing.T) {
	ic := []int{3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8}
	lt8 := RunWithInput(ic, 7)[0]
	if lt8 != 1 {
		t.Errorf("expected 1; actual; %d", lt8)
	}
	nlt8 := RunWithInput(ic, 9)[0]
	if nlt8 != 0 {
		t.Errorf("expected 0; actual %d", nlt8)
	}
}

func TestRunWithInput_5_2_4(t *testing.T) {
	ic := []int{3, 3, 1107, -1, 8, 3, 4, 3, 99}
	lt8 := RunWithInput(ic, 7)[0]
	if lt8 != 1 {
		t.Errorf("expected 1; actual; %d", lt8)
	}
	nlt8 := RunWithInput(ic, 9)[0]
	if nlt8 != 0 {
		t.Errorf("expected 0; actual %d", nlt8)
	}
}

func TestRun_2(t *testing.T) {
	tests := []struct {
		input    []int
		expected int
	}{
		{[]int{1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50}, 3500},
		{[]int{1, 0, 0, 0, 99}, 2},
		{[]int{2, 3, 0, 3, 99}, 2},
		{[]int{2, 4, 4, 5, 99, 0}, 2},
		{[]int{1, 1, 1, 4, 99, 5, 6, 0, 99}, 30},
	}

	for _, test := range tests {
		Run(test.input)
		if test.input[0] != test.expected {
			t.Errorf(
				"actual %d; expected %d",
				test.input[0],
				test.expected,
			)
		}
	}
}
