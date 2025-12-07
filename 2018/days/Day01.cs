namespace _2018.days;
public static class Day01
{
    public static void Run()
    {
        int[] changes = [.. File.ReadAllLines("inputs/day01.txt").Select(line => int.Parse(line))];
        Console.WriteLine($"Part 1: {changes.Sum()}");
        HashSet<int> freqs = [0];
        int freq = 0;
        int i = 0;
        while (true)
        {
            freq += changes[i % changes.Length];
            if (freqs.Contains(freq))
            {
                System.Console.WriteLine($"Part 2: {freq}");
                break;
            }
            freqs.Add(freq);
            i++;
        }
    }
}
        