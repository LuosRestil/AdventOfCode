namespace _2025.common;

public class Range(long start, long end)
{
    public long Start { get; set; } = start;
    public long End { get; set; } = end;

    public bool Contains(long val) => Start <= val && End >= val;

    public static List<Range> CollapseRanges(List<Range> ranges)
    {
        ranges = [.. ranges.OrderBy(range => range.Start)];
        int i = 0;
        while (i < ranges.Count - 1)
        {
            if (ranges[i + 1].Start <= ranges[i].End)
            {
                if (ranges[i + 1].End > ranges[i].End)
                    ranges[i].End = ranges[i + 1].End;
                if (
                    ranges[i + 1].Start >= ranges[i].Start && 
                    ranges[i + 1].End <= ranges[i].End)
                {
                    ranges.RemoveAt(i + 1);
                    continue;
                }
            }
            i++;
        }
        return ranges;
    }
}