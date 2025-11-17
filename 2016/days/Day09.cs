using System.Text.RegularExpressions;

namespace _2016.days;

public static partial class Day09
{
    public static void Run()
    {
        string compressed = File.ReadAllText("inputs/day09.txt");
        Console.WriteLine($"Part 1: {DecompressedLength(compressed)}");
        Console.WriteLine($"Part 2: {DecompressedLength(compressed, true)}");
    }

    public static long DecompressedLength(string compressed, bool isPartTwo = false)
    {
        MatchCollection markerMatches = MarkerRegex().Matches(compressed);
        Dictionary<int, Match> markers = [];
        foreach (Match markerMatch in markerMatches)
            markers[markerMatch.Index] = markerMatch;

        long size = 0;
        int p = 0;
        while (p < compressed.Length)
        {
            if (markers.TryGetValue(p, out Match? marker))
            {
                p += marker.Length;
                int[] markerData = [.. marker.Groups[1].ToString().Split('x').Select(int.Parse)];
                int numChars = markerData[0];
                int repetitions = markerData[1];
                size += (isPartTwo ? GetExpandedSize(compressed.Substring(p, numChars), p, markers) : numChars) * repetitions;
                p += numChars;
            }
            else
            {
                size++;
                p++;
            }
        }
        return size;
    }

    private static long GetExpandedSize(string str, int idx, Dictionary<int, Match> markers)
    {
        long size = 0;
        int p = 0;
        while (p < str.Length)
        {
            if (markers.TryGetValue(p + idx, out Match? marker))
            {
                p += marker.Length;

                int[] markerData = [.. marker.Groups[1].ToString().Split('x').Select(int.Parse)];
                int numChars = markerData[0];
                int repetitions = markerData[1];

                size += repetitions * GetExpandedSize(str.Substring(p, numChars), idx + p, markers);
                p += numChars;
            }
            else
            {
                size++;
                p++;
            }
        }
        return size;
    }

    [GeneratedRegex(@"\((\d+x\d+)\)")]
    private static partial Regex MarkerRegex();
}
