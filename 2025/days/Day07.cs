namespace _2025.days;

public static class Day07
{
    static int splits = 0;

    public static void Run()
    {
        string[] grid = File.ReadAllLines("inputs/day07.txt");
        long timelines = CountTimelines(grid, 0, grid[0].IndexOf('S'), []);
        Console.WriteLine($"Part 1: {splits}");
        Console.WriteLine($"Part 2: {timelines}");
    }

    private static long CountTimelines(string[] grid, int row, int col, Dictionary<Tuple<int, int>, long> memo)
    {
        Tuple<int, int> key = new(row, col);
        if (memo.TryGetValue(key, out long value))
            return value;

        if (row == grid.Length) return 1;

        if (grid[row][col] == '^')
        {
            splits++;
            memo[key] = CountTimelines(grid, row + 1, col - 1, memo) + CountTimelines(grid, row + 1, col + 1, memo);
        }
        else
            memo[key] = CountTimelines(grid, row + 1, col, memo);

        return memo[key];
    }
}
