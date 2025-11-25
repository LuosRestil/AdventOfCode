using System.Text.RegularExpressions;
using _2016.common.math;

namespace _2016.days;

public class FsNode
{
    public int Size { get; set; }
    public int Used { get; set; }
    public int Avail { get; set; }
    public float UsedPct { get; set; }
    public required string Name { get; set; }

    public FsNode Copy()
    {
        return new() { Size = Size, Used = Used, Avail = Avail, UsedPct = UsedPct, Name = Name };
    }
}

public class FsState
{
    public required FsNode[,] Fs { get; set; }
    public int Steps { get; set; }
    public Vec2 Empty { get; set; }

}

public static partial class Day22
{
    private static readonly int w = 37;
    private static readonly int h = 25;
    private static string target = "";

    public static void Run()
    {
        FsNode[,] fs = new FsNode[h, w];

        Vec2 empty = new(0, 0);

        foreach (var line in File.ReadLines("inputs/day22.txt"))
        {
            string[] parts = SpacesRegex().Split(line);

            string[] xyparts = parts[0].Split('-');
            int x = int.Parse(xyparts[1][1..]);
            int y = int.Parse(xyparts[2][1..]);

            int size = int.Parse(parts[1][..^1]);
            int used = int.Parse(parts[2][..^1]);
            int avail = int.Parse(parts[3][..^1]);
            float usedPct = float.Parse("0." + parts[4][..^1]);
            fs[y, x] = new FsNode { Size = size, Used = used, Avail = avail, UsedPct = usedPct, Name = parts[0] };

            if (x == w - 1 && y == 0)
                target = parts[0];
            if (used == 0)
                empty = new(x, y);
        }


        Console.WriteLine($"Part 1: {CountViablePairs(fs)}");
        Console.WriteLine($"Part 2: {BFS(new FsState() { Fs = fs, Steps = 0, Empty = empty })}");
    }

    private static int CountViablePairs(FsNode[,] fs)
    {
        int viablePairs = 0;
        for (int y = 0; y < h; y++)
        {
            for (int x = 0; x < w; x++)
            {
                FsNode a = fs[y, x];
                if (a.Used == 0) continue;

                for (int y2 = 0; y2 < h; y2++)
                {
                    for (int x2 = 0; x2 < w; x2++)
                    {
                        FsNode b = fs[y2, x2];
                        if (a != b && a.Used <= b.Avail)
                            viablePairs++;
                    }
                }
            }
        }
        return viablePairs;
    }

    private static int BFS(FsState startState)
    {
        List<FsState> queue = [startState];
        while (queue.Count > 0)
        {
            FsState state = queue[0];
            queue.RemoveAt(0);
            if (state.Fs[0, 0].Name == target)
                return state.Steps;
            queue.AddRange(GetNeighborStates(state));
        }
        return 0;
    }

    private static List<FsState> GetNeighborStates(FsState state)
    {
        List<FsState> neighborStates = [];



        return neighborStates;
    }

    private static FsNode[,] Copy(FsNode[,] array)
    {
        int width = array.GetLength(0);
        int height = array.GetLength(1);
        FsNode[,] copy = new FsNode[width, height];

        for (int w = 0; w < width; w++)
        {
            for (int h = 0; h < height; h++)
            {
                copy[w, h] = array[w, h].Copy();
            }
        }

        return copy;
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex SpacesRegex();
}
