package intcode

import (
	"reflect"
	"testing"
)

func TestParseInstruction(t *testing.T) {
	actual := parseInstruction(1002)
	expected := instructionData{
		opcode: 2,
		modes: []int{0,1,0},
	}
	if !reflect.DeepEqual(actual, expected) {
		t.Errorf("actual %v; expected %v", actual, expected)
	}
}

func TestParseInstruction2(t *testing.T) {
	actual := parseInstruction(1008)
	expected := instructionData{
		opcode: 8,
		modes: []int{0,1,0},
	}
	if !reflect.DeepEqual(actual, expected) {
		t.Errorf("actual %v; expected %v", actual, expected)
	}
}

func TestIntcodeTransform(t *testing.T) {
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