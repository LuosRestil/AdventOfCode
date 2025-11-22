namespace _2016.days;

public record struct Disc(int Len, int Offset);

public static class Day15
{
    public static void Run()
    {
        List<Disc> discs = [.. File.ReadLines("inputs/day15.txt").Select(line =>
        {
            string[] split = line.Split(' ');
            return new Disc(int.Parse(split[3]), int.Parse(split[^1][..^1]));
        })];

        
        Console.WriteLine($"Part 1: {GetStart(discs)}");
        discs.Add(new Disc(11, 0));
        Console.WriteLine($"Part 2: {GetStart(discs)}");
    }

    private static int GetStart(List<Disc> discs)
    {
        int time = 0;
        bool answered = false;
        while (!answered)
        {
            time++;
            answered = true;
            for (int i = 0; i < discs.Count; i++)
            {
                if (!IsSlot(time, i+1, discs[i]))
                {
                    answered = false;
                    break;
                }
            }
        }
        return time;
    }

    private static bool IsSlot(int time, int discNum, Disc disc)
    {
        return (time + discNum + disc.Offset) % disc.Len == 0;
    }
}
