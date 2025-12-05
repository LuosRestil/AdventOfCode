namespace _2025.days;
using _2025.common;

public static class Day05
{
    public static void Run()
    {
        string[] lines = File.ReadAllLines("inputs/day05.txt");
        List<Range> ranges = [];
        List<long> foods = [];
        foreach (string line in lines)
        {
            if (line.Length == 0) continue;
            string[] sp = line.Split('-');
            if (sp.Length == 1)
                foods.Add(long.Parse(sp[0]));
            else
                ranges.Add(new(long.Parse(sp[0]), long.Parse(sp[1])));
        }
        ranges = Range.CollapseRanges(ranges);

        int freshIngredients = 0;
        foreach (var food in foods)
        {
            foreach (var range in ranges)
            {
                if (range.Contains(food))
                {
                    freshIngredients += 1;
                    break;
                }
            }
        }
        System.Console.WriteLine($"Part 1: {freshIngredients}");

        long possibleFreshIngredients = 0;
        foreach (var range in ranges)
        {
            possibleFreshIngredients += (range.End - range.Start) + 1;
        }
        System.Console.WriteLine($"Part 2: {possibleFreshIngredients}");
    }
}
        