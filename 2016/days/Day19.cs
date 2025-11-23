namespace _2016.days;

public static class Day19
{
    public static void Run()
    {
        int numElves = int.Parse(File.ReadAllText("inputs/day19.txt"));
        int ans1 = 1;
        int ans2 = 1;
        for (int i = 4; i < numElves; i++)
        {
            if (ans1 == i) ans1 = 1;
            else ans1 += 2;

            if (ans2 == i) ans2 = 1;
            else if (ans2 < (int)Math.Ceiling(i/2.0) )
                ans2++;
            else
                ans2+=2;
        }
        Console.WriteLine($"Part 1: {ans1}");
        Console.WriteLine($"Part2 : {ans2}");
    }
}
