using System.Text;

namespace _2016.days;
public static class Day08
{
    private static readonly int gridWidth = 50;
    private static readonly int gridHeight = 6;
    private static readonly StringBuilder sb = new();
    
    public static void Run()
    {
        List<string> grid = MakeGrid(gridWidth, gridHeight);
        var instructions = File.ReadLines("inputs/day08.txt");
        foreach (var instruction in instructions)
        {
            Execute(instruction, grid);
        }
        Console.WriteLine($"Part 1: {CountPixels(grid)}");
        Console.WriteLine($"Part 2:");
        PrintGrid(grid);
    }

    private static void Execute(string instruction, List<string> grid)
    {
        if (instruction.StartsWith("rect"))
            ExecuteRectInstruction(instruction, grid);
        else
            ExecuteRotateInstruction(instruction, grid);
    }

    private static void ExecuteRectInstruction(string instruction, List<string> grid)
    {
        var dims = instruction.Split(' ')[1].Split('x').Select(int.Parse).ToArray();
        SetRect(grid, dims[0], dims[1]);
    }

    private static void ExecuteRotateInstruction(string instruction, List<string> grid)
    {
        string[] parts = instruction.Split(' ');
        int idx = int.Parse(parts[2].Split('=')[1]);
        int amt = int.Parse(parts[4]);
        if (parts[1] == "column")
        {
            string col = GetCol(grid, idx);
            string shifted = Shift(col, amt);
            SetCol(grid, idx, shifted);
        }
        else
        {
            string row = GetRow(grid, idx);
            string shifted = Shift(row, amt);
            SetRow(grid, idx, shifted);
        }
    }

    private static string GetCol(List<string> grid, int idx)
    {
        sb.Clear();
        foreach (var row in grid)
            sb.Append(row[idx]);
        return sb.ToString();
    }

    private static string Shift(string str, int amt)
    {
        amt %= str.Length;
        return str[^amt..] + str[..^amt];
        throw new NotImplementedException();
    }

    private static void SetCol(List<string> grid, int idx, string val)
    {
        for (int i = 0; i < grid.Count; i++)
        {
            sb.Clear();
            sb.Append(grid[i]);
            sb[idx] = val[i];
            grid[i] = sb.ToString();
        }
    }

    private static string GetRow(List<string> grid, int idx)
    {
        return grid[idx];
    }

    private static void SetRow(List<string> grid, int idx, string val)
    {
        grid[idx] = val;
    }

    private static void SetRect(List<string> grid, int width, int height)
    {
        for (int i = 0; i < height; i++)
        {
            StringBuilder sb = new();
            for (int j = 0; j < width; j++) sb.Append('#');
            grid[i] = sb.ToString() + grid[i][width..];
        }
    }

    private static List<string> MakeGrid(int width, int height)
    {
        List<string> grid = [];
        for (int i = 0; i < height; i++)
        {
            sb.Clear();
            for (int j = 0; j < width; j++)
            {
                sb.Append('.');
            }
            grid.Add(sb.ToString());
        }
        return grid;
    }

    private static void PrintGrid(List<string> grid)
    {
        foreach (var row in grid)
            Console.WriteLine(row);
    }

    private static int CountPixels(List<string> grid)
    {
        return grid.Aggregate(0, (acc, curr) => acc + curr.Where(c => c == '#').Count());
    }
}
        