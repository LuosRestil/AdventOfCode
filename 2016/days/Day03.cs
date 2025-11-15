using System.Text.RegularExpressions;

namespace _2016.days;
public static partial class Day03
{
    public static void Run()
    {
        List<int[]> tris = [.. File.ReadLines("inputs/day03.txt")
            .Select(line =>
                Spaces().Split(line)
                    .Where(s => s.Length > 0)
                    .Select(num => int.Parse(num))
                    .ToArray())];
        var validTris = tris.Where(IsValidTriangle).Count();
        Console.WriteLine($"Part 1: {validTris}");

        var col1 = tris.Select(line => line[0]).ToArray();
        var col2 = tris.Select(line => line[1]).ToArray();
        var col3 = tris.Select(line => line[2]).ToArray();
        tris = [.. GroupThrees(col1), .. GroupThrees(col2), .. GroupThrees(col3)];
        validTris = tris.Where(IsValidTriangle).Count();
        Console.WriteLine($"Part 2: {validTris}");
    }

    private static bool IsValidTriangle(int[] sides)
    {
        bool valid =
            sides[0] + sides[1] > sides[2] &&
            sides[0] + sides[2] > sides[1] &&
            sides[1] + sides[2] > sides[0];
        return valid;
    }

    private static List<int[]> GroupThrees(int[] nums)
    {
        List<int[]> res = [];
        int[] curr = new int[3];
        for (int i = 0; i < nums.Length; i++)
        {
            int mod = i % 3;
            if (i > 0 && mod == 0)
            {
                res.Add(curr);
                curr = new int[3];
            }
            curr[mod] = nums[i];
        }
        res.Add(curr);
        return res;
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex Spaces();
}
