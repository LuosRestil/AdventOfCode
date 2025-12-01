namespace _2025.days;

public class Day01
{
    public static void Run()
    {
        int idx = 50;
        int zeroes = 0;
        int passedZeroes = 0;
        File.ReadLines("inputs/day01.txt").ToList().ForEach(line =>
        {
            bool r = line.StartsWith('R');
            int amt = int.Parse(line[1..]);
            for (int i = 0; i < amt; i++)
            {
                idx += r ? 1 : -1;
                if (idx < 0) idx = 99;
                if (idx > 99) idx = 0;
                if (idx == 0) passedZeroes++;
            }
            if (idx == 0) zeroes++;
        });
        Console.WriteLine($"Part 1: {zeroes}");
        Console.WriteLine($"Part 2: {passedZeroes}");
    }
}