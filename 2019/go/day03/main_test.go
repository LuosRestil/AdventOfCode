package main

import (
	"reflect"
	"testing"
)

func TestGetIntersection(t *testing.T) {
	tests := []struct {
		segment1            segment
		segment2            segment
		expectedIntersects  bool
		expectedPt point
	}{
		{
			segment{point{X: 8, Y: -5}, point{X: 3, Y: -5}},
			segment{point{X: 6, Y: -7}, point{X: 6, Y: -3}},
			true,
			point{X: 6, Y: -5},
		},
		{
			segment{point{X: 3, Y: -5}, point{X: 8, Y: -5}},
			segment{point{X: 6, Y: -7}, point{X: 6, Y: -3}},
			true,
			point{X: 6, Y: -5},
		},
		{
			segment{point{X: 8, Y: -5}, point{X: 3, Y: -5}},
			segment{point{X: 6, Y: -3}, point{X: 6, Y: -7}},
			true,
			point{X: 6, Y: -5},
		},
		{
			segment{point{X: 3, Y: -5}, point{X: 8, Y: -5}},
			segment{point{X: 6, Y: -3}, point{X: 6, Y: -7}},
			true,
			point{X: 6, Y: -5},
		},
	}

	for _, test := range tests {
		intersects, pt := getIntersection(test.segment1, test.segment2)
		if intersects != test.expectedIntersects || !reflect.DeepEqual(pt, test.expectedPt) {
			t.Errorf(
				"getIntersection(%v, %v) = %t, %v; expected %t, %v",
				test.segment1, test.segment2, intersects, pt,
				test.expectedIntersects, test.expectedPt,
			)
		}
	}
}
