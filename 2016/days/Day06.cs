namespace _2016.days;
public static class Day06
{
    public static void Run()
    {
        string[] lines = File.ReadAllLines("inputs/day06.txt");
        List<List<char>> cols = [];
        for (int i = 0; i < lines[0].Length; i++) cols.Add([]);
        foreach (var line in lines)
        {
            for (int i = 0; i < line.Length; i++)
            {
                cols[i].Add(line[i]);
            }
        }
        List<char> ans1 = [];
        List<char> ans2 = [];
        foreach (var col in cols)
        {
            Tuple<char, char> leastAndMost = GetLeastAndMostFrequentChar(col);
            ans1.Add(leastAndMost.Item2);
            ans2.Add(leastAndMost.Item1);
        }
        Console.WriteLine($"Part 1: {string.Join(null, ans1)}");
        Console.WriteLine($"Part 2: {string.Join(null, ans2)}");
    }

    private static Tuple<char, char> GetLeastAndMostFrequentChar(List<char> chars)
    {
        Dictionary<char, int> freqs = [];
        foreach (var c in chars)
        {
            if (!freqs.ContainsKey(c))
                freqs[c] = 0;
            freqs[c]++;
        }
        var ordered = freqs.OrderBy(item => item.Value);
        var least = ordered.First().Key;
        var most = ordered.Last().Key;
        return new Tuple<char, char>(least, most);
    }
}
        