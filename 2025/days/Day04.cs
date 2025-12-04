using _2025.common;

namespace _2025.days;

public static class Day04
{
    public static void Run()
    {
        char[][] grid = [.. File.ReadAllLines("inputs/day04.txt").Select(row => row.ToCharArray())];
        int total = 0;
        for (int i = 0; i < grid.Length; i++)
        {
            for (int j = 0; j < grid[0].Length; j++)
            {
                if (grid[i][j] != '@') continue;
                int neighborRolls = GetNeighbors(grid, new(j, i)).Where(c => c == '@').Count();
                if (neighborRolls < 4)
                    total++;
            }
        }
        Console.WriteLine($"Part 1: {total}");

        bool finished = false;
        int removed = 0;
        while (!finished)
        {
            finished = true;
            for (int i = 0; i < grid.Length; i++)
            {
                for (int j = 0; j < grid[0].Length; j++)
                {
                    if (grid[i][j] != '@') continue;
                    int neighborRolls = GetNeighbors(grid, new(j, i)).Where(c => c == '@' || c == 'x').Count();
                    if (neighborRolls < 4)
                        grid[i][j] = 'x';
                }
            }
            for (int i = 0; i < grid.Length; i++)
            {
                for (int j = 0; j < grid.Length; j++)
                {
                    if (grid[i][j] == 'x')
                    {
                        grid[i][j] = '.';
                        removed++;
                        finished = false;
                    }
                }
            }
        }
        Console.WriteLine($"Part 2: {removed}");
    }

    public static List<char> GetNeighbors(char[][] grid, Vec2 pos)
    {
        List<char> neighbors = [];
        for (int i = -1; i <= 1; i++)
        {
            for (int j = -1; j <= 1; j++)
            {
                if (i == 0 && j == 0) continue;
                try
                {
                    neighbors.Add(grid[pos.Y + i][pos.X + j]);
                }
                catch (Exception)
                {
                    // ignore
                }
            }
        }
        return neighbors;
    }
}
