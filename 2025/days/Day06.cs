using System.Text;
using System.Text.RegularExpressions;

namespace _2025.days;

public class Problem
{
    public int StartIdx { get; set; }
    public int EndIdx { get; set; }
    public char Operator { get; set; }
    public List<long> Operands { get; set; } = [];

    public long Solve()
    {
        return Operands.Aggregate(
            Operator == '*' ? 1L : 0L,
            (acc, curr) => Operator == '*' ? acc * curr : acc + curr);
    }
}

public static partial class Day06
{
    public static void Run()
    {
        string[] lines = File.ReadAllLines("inputs/day06other.txt");
        string[][] grid = [.. lines.Select(line => Spaces().Split(line))];
        long grandTotal = 0;
        for (int col = 0; col < grid[0].Length; col++)
        {
            Problem problem = new() { Operator = grid[^1][col][0] };
            for (int row = 0; row < grid.Length - 1; row++)
                problem.Operands.Add(long.Parse(grid[row][col]));
            grandTotal += problem.Solve();
        }
        Console.WriteLine($"Part 1: {grandTotal}");


        string lastLine = lines[^1];
        int problemCount = lastLine.Where(c => c != ' ').Count();
        List<Problem> problems = [];
        for (int i = 0; i < lastLine.Length; i++)
        {
            char c = lastLine[i];
            if (c == '+' || c == '*')
            {
                Problem problem = new() { StartIdx = i, Operator = c };
                try { problems[^1].EndIdx = i - 2; }
                catch (ArgumentOutOfRangeException) { }
                problems.Add(problem);
            }
        }
        problems[^1].EndIdx = lastLine.Length - 1;

        foreach (var problem in problems)
        {
            for (int col = problem.EndIdx; col >= problem.StartIdx; col--)
            {
                StringBuilder sb = new();
                for (int row = 0; row < lines.Length - 1; row++)
                {
                    if (lines[row][col] != ' ') sb.Append(lines[row][col]);
                }
                problem.Operands.Add(long.Parse(sb.ToString()));
            }
        }
        Console.WriteLine($"Part 2: {problems.Aggregate(0L, (acc, curr) => acc += curr.Solve())}");
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex Spaces();
}
