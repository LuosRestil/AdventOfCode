using _2025.common;

namespace _2025.days;

public static class Day09
{
    public static void Run()
    {
        Vec2L[] tiles = [.. File.ReadAllLines("inputs/day09.txt")
            .Select(line => line.Split(',').Select(num => long.Parse(num)).ToArray())
            .Select(sp => new Vec2L(sp[0], sp[1]))];
        long maxSize = 0;
        for (int i = 0; i < tiles.Length - 1; i++)
        {
            for (int j = i + 1; j < tiles.Length; j++)
            {
                var a = tiles[i];
                var b = tiles[j];
                long size = (Math.Abs(a.X - b.X) + 1) * (Math.Abs(a.Y - b.Y) + 1);
                if (size > maxSize) maxSize = size;
            }
        }
        Console.WriteLine($"Part 1: {maxSize}");
    }
}
