package vec

import "math"

type Vec2 struct {
	X, Y float64
}

func (v Vec2) Add(other Vec2) Vec2 {
	return Vec2{
		X: v.X + other.X,
		Y: v.Y + other.Y,
	}
}

func (v Vec2) Sub(other Vec2) Vec2 {
	return Vec2{
		X: v.X - other.X,
		Y: v.Y - other.Y,
	}
}

func (v Vec2) Scale(factor float64) Vec2 {
	return Vec2{
		X: v.X * factor,
		Y: v.Y * factor,
	}
}

func (v Vec2) Mag() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func (v Vec2) Dist(other Vec2) float64 {
	return v.Sub(other).Mag()
}

func (v Vec2) Unit() Vec2 {
	mag := v.Mag()
	if mag == 0 {
		return Vec2{X: 0, Y: 0}
	}
	return Vec2{
		X: v.X / mag,
		Y: v.Y / mag,
	}
}

func Unit(v Vec2) Vec2 {
	return v.Unit()
}