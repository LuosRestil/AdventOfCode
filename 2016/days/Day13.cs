using _2016.common.math;

namespace _2016.days;

public record struct Step(Vec2 Pos, int Count);

public static class Day13
{
    static int favNum;

    public static void Run()
    {
        favNum = int.Parse(File.ReadAllText("inputs/day13.txt"));
        Vec2 target = new(31, 39);
        Vec2 start = new(1, 1);
        Dictionary<Vec2, bool> walls = new() { { start, false } };
        List<Step> queue = [new Step(start, 0)];

        int ans1 = 0;
        int ans2 = 0;
        while (queue.Count > 0)
        {
            Step step = queue.First();
            queue.RemoveAt(0);
            if (step.Pos == target)
            {
                ans1 = step.Count;
            }
            if (step.Count <= 50) ans2++;
            List<Step> adjacent = GetAdjacentSteps(step, walls);
            queue.AddRange(adjacent);
        }
        
        Console.WriteLine($"Part 1: {ans1}");
        Console.WriteLine($"Part 2: {ans2}");
    }

    private static List<Step> GetAdjacentSteps(Step step, Dictionary<Vec2, bool> walls)
    {
        List<Step> validSteps = [];
        List<Vec2> adjacent = [
            new(step.Pos.X - 1, step.Pos.Y),
            new(step.Pos.X + 1, step.Pos.Y),
            new(step.Pos.X, step.Pos.Y - 1),
            new(step.Pos.X, step.Pos.Y + 1)];
        foreach (var pos in adjacent)
        {
            if (pos.X >= 0 && pos.Y >= 0)
            {
                if (walls.ContainsKey(pos))
                    continue;
                walls[pos] = IsWall(pos);
                if (!walls[pos])
                    validSteps.Add(new(pos, step.Count + 1));
            }
        }
        return validSteps;
    }

    private static bool IsWall(Vec2 pos)
    {
        int x = pos.X, y = pos.Y;
        int trans = x * x + 3 * x + 2 * x * y + y + y * y + favNum;
        string bin = Convert.ToString(trans, 2);
        int ones = bin.Where(c => c == '1').Count();
        return ones % 2 != 0;
    }
}
