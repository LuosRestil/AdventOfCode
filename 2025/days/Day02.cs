namespace _2025.days;

public class Day02Range(long start, long end)
{
    public long Start { get; set; } = start;
    public long End { get; set; } = end;
}

public static class Day02
{
    public static void Run()
    {
        List<Day02Range> ranges = [.. File.ReadAllText("inputs/day02.txt").Split(',').Select(rng =>
        {
            string[] split = rng.Split('-');
            return new Day02Range(long.Parse(split[0]), long.Parse(split[1]));
        }).OrderBy(rng => rng.Start)];
        long highestValue = ranges[^1].End;

        HashSet<long> invalidNums = [];
        HashSet<long> moreInvalidNums = [];

        long curr = 1;
        while (true)
        {
            string currStr = curr.ToString();
            string doubleStr = currStr + currStr;
            long invalidNum = long.Parse(doubleStr);
            invalidNums.Add(invalidNum);
            moreInvalidNums.Add(invalidNum);
            if (invalidNum > highestValue) break;

            string multStr = currStr;
            while (invalidNum < highestValue)
            {
                multStr += currStr;
                invalidNum = long.Parse(multStr);
                moreInvalidNums.Add(invalidNum);
            }

            curr++;
        }

        long total = 0;
        foreach (long invalidNum in invalidNums)
        {
            foreach (var range in ranges)
            {
                if (invalidNum >= range.Start && invalidNum <= range.End)
                {
                    total += invalidNum;
                    break;
                }
            }
        }
        Console.WriteLine($"Part 1: {total}");

        total = 0;
        foreach (long invalidNum in moreInvalidNums)
        {
            foreach (var range in ranges)
            {
                if (invalidNum >= range.Start && invalidNum <= range.End)
                {
                    total += invalidNum;
                    break;
                }
            }
        }
        Console.WriteLine($"Part 2: {total}");
    }
}
