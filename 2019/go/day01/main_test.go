package main

import "testing"

func TestGetFuelReq(t *testing.T) {
	tests := []struct {
		mass     int
		expected int
	}{
		{12, 2},
		{14, 2},
		{1969, 654},
		{100756, 33583},
	}

	for _, test := range tests {
		result := getFuelReq(test.mass)
		if result != test.expected {
			t.Errorf(
				"getFuelReq(%d) = %d; expected %d",
				test.mass,
				result,
				test.expected,
			)
		}
	}
}

func TestGetFuelReq2(t *testing.T) {
	tests := []struct {
		mass     int
		expected int
	}{
		{14, 2},
		{1969, 966},
		{100756, 50346},
	}

	for _, test := range tests {
		result := getFuelReq2(test.mass)
		if result != test.expected {
			t.Errorf(
				"getFuelReq(%d) = %d; expected %d",
				test.mass,
				result,
				test.expected,
			)
		}
	}
}