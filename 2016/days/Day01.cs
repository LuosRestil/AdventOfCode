using _2016.common.math;

namespace _2016.days;

public static class Day01
{
    public static void Run()
    {
        int dir = 0; // up
        Vec2 pos = new(0, 0);
        string[] instructions = File.ReadAllText("inputs/day01.txt").Split(", ");

        List<Line> lines = [];

        foreach (var instruction in instructions)
        {
            var turnDir = instruction[..1];
            int travelDist = int.Parse(instruction[1..]);
            if (turnDir == "R")
                dir++;
            else
                dir--;
            if (dir > 3) dir = 0;
            if (dir < 0) dir = 3;
            Vec2 newPos = Move(pos, dir, travelDist);
            lines.Add(new Line(pos, newPos));
            pos = newPos;
        }
        Console.WriteLine($"Part 1: {Math.Abs(pos.X) + Math.Abs(pos.Y)}");

        for (int i = 1; i < lines.Count; i++)
        {
            Vec2? intersection = FindFirstIntersection(lines[i], lines[..(i-1)]);
            if (intersection != null)
            {
                Console.WriteLine($"Part 2: {Math.Abs(intersection.Value.X) + Math.Abs(intersection.Value.Y)}");
                break;
            }
        }
    }

    private static Vec2 Move(Vec2 pos, int dir, int dist)
    {
        switch (dir)
        {
            case 0: pos.Y -= dist; break;
            case 1: pos.X += dist; break;
            case 2: pos.Y += dist; break;
            case 3: pos.X -= dist; break;
            default: throw new Exception("Invalid direction");
        }
        return pos;
    }

    private static Vec2? FindFirstIntersection(Line line, List<Line> lines)
    {
        foreach (Line other in lines)
        {
            Vec2? intersection = Intersection(line, other);
            if (intersection.HasValue)
            {
                return intersection.Value;
            }
        }
        return null;
    }

    private static bool IsVertical(Line line)
    {
        return line.Start.X == line.End.X;
    }

    private static Vec2? Intersection(Line l1, Line l2)
    {
        bool l1Vert = IsVertical(l1);
        bool l2Vert = IsVertical(l2);
        if ((l1Vert && l2Vert) || (!l1Vert && !l2Vert)) return null;

        Line vert = l1Vert ? l1 : l2;
        Line horiz = l1Vert ? l2 : l1; 

        if (MathUtils.IsBetween(vert.Start.X, horiz.Start.X, horiz.End.X) && MathUtils.IsBetween(horiz.Start.Y, vert.Start.Y, vert.End.Y))
            return new Vec2(vert.Start.X, horiz.Start.Y);
        return null;
    }
}