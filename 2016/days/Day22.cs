using System.Text.RegularExpressions;
using _2016.common.math;

namespace _2016.days;

public class FsNode
{
    public int Size { get; set; }
    public int Used { get; set; }
    public int Avail { get; set; }
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

    public static void Run()
    {
        FsNode[,] fs = new FsNode[h, w];

        foreach (var line in File.ReadLines("inputs/day22.txt"))
        {
            string[] parts = SpacesRegex().Split(line);

            string[] xyparts = parts[0].Split('-');
            int x = int.Parse(xyparts[1][1..]);
            int y = int.Parse(xyparts[2][1..]);

            int size = int.Parse(parts[1][..^1]);
            int used = int.Parse(parts[2][..^1]);
            int avail = int.Parse(parts[3][..^1]);
            fs[y, x] = new FsNode { Size = size, Used = used, Avail = avail };
        }

        Console.WriteLine($"Part 1: {CountViablePairs(fs)}");
        PrintFs(fs); // pt 2 trivially worked by hand
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

    private static void PrintFs(FsNode[,] fs)
    {
        for (int i = 0; i < fs.GetLength(0); i++)
        {
            for (int j = 0; j < fs.GetLength(1); j++)
            {
                Console.Write(fs[i,j].Used == 0 ? '_' : fs[i,j].Size > 500 ? '#' : '.');
            }
            System.Console.WriteLine();
        }
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex SpacesRegex();
}
