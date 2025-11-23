namespace _2016.days;

public class IpRange(long start, long end)
{
    public long Start { get; set; } = start;
    public long End { get; set; } = end;
}

public static class Day20
{
    public static void Run()
    {
        List<IpRange> ipRanges = [.. File.ReadAllLines("inputs/day20.txt")
            .Select(line => line.Split('-').Select(long.Parse).ToArray())
            .Select(pair => new IpRange(pair[0], pair[1]))
            .OrderBy(range => range.Start)];
        CollapseRanges(ipRanges);
        Console.WriteLine($"Part 1: {GetLowestOpenIp(ipRanges)}");
    }

    private static void CollapseRanges(List<IpRange> ipRanges)
    {
        int i = 0;
        while (i < ipRanges.Count - 1)
        {
            if (ipRanges[i + 1].Start <= ipRanges[i].End)
            {
                if (ipRanges[i + 1].End > ipRanges[i].End)
                    ipRanges[i].End = ipRanges[i + 1].End;
                if (
                    ipRanges[i + 1].Start >= ipRanges[i].Start && 
                    ipRanges[i + 1].End <= ipRanges[i].End)
                {
                    ipRanges.RemoveAt(i + 1);
                    continue;
                }
            }
            i++;
        }
    }

    public static Tuple<long, long> GetLowestOpenIp(List<IpRange> ipRanges)
    {
        long lowestOpenIp = long.MaxValue;
        List<IpRange> openRanges = [];
        if (ipRanges[0].Start > 0) lowestOpenIp = 0;
        for (int i = 0; i < ipRanges.Count - 1; i++)
        {
            if (ipRanges[i + 1].Start > ipRanges[i].End + 1)
            {
                if (ipRanges[i].End + 1 < lowestOpenIp)
                    lowestOpenIp = ipRanges[i].End + 1;
                openRanges.Add(new(ipRanges[i].End + 1, ipRanges[i + 1].Start - 1));
            }
        }
        long totalOpenIps = openRanges.Select(range => range.End - range.Start + 1).Sum();
        return new(lowestOpenIp, totalOpenIps);
    }
}
