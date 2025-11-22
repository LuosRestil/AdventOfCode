namespace _2016.days;
public static class Day18
{
    private static readonly HashSet<string> trapConfigs = ["^^.", ".^^", "^..", "..^"];
    public static void Run()
    {
        int safeCount = 0;
        string curr = File.ReadAllText("inputs/day18.txt");
        for (int i = 0; i < 40; i++)
        {
            safeCount += curr.Where(c => c == '.').Count();
            curr = GetNextRow(curr);
        }
        Console.WriteLine($"Part 1: {safeCount}");

        for (int i = 40; i < 400000; i++)
        {
            safeCount += curr.Where(c => c == '.').Count();
            curr = GetNextRow(curr);
        }
        System.Console.WriteLine($"Part 2: {safeCount}");
    }

    private static string GetNextRow(string row)
    {
        char[] nextRow = new char[row.Length];
        for (int i = 0; i < row.Length; i++)
        {
            if (i == 0)
                nextRow[i] = GetSpaceFromAbove('.' + row[..2]);
            else if (i == row.Length - 1)
                nextRow[i] = GetSpaceFromAbove(row[^2..] + '.');
            else
                nextRow[i] = GetSpaceFromAbove(row[(i-1)..(i+2)]);
        }
        return new string(nextRow);
    }

    private static char GetSpaceFromAbove(string config)
    {
        return trapConfigs.Contains(config) ? '^' : '.';
    }
}
        