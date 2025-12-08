namespace _2018.days;

public class Claim
{
    public int Row { get; set; }
    public int Col { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public int Id { get; set; }
}

public static class Day03
{
    public static void Run()
    {
        char[,] grid = new char[1000, 1000];
        for (int i = 0; i < grid.GetLength(0); i++)
            for (int j = 0; j < grid.GetLength(1); j++)
                grid[i, j] = '.';

        Claim[] claims = [.. File.ReadAllLines("inputs/day03.txt")
            .Select(line =>
            {
                string[] sp = line.Split(' ');
                int id = int.Parse(sp[0][1..]);
                int[] rowcol = sp[2][..^1].Split(',').Select(num => int.Parse(num)).ToArray();
                int[] widthheight = sp[3].Split('x').Select(num => int.Parse(num)).ToArray();
                return new Claim() { Id = id, Col = rowcol[0], Row = rowcol[1], Width = widthheight[0], Height = widthheight[1] };
            })];

        foreach (var claim in claims)
        {
            for (int row = claim.Row; row < claim.Row + claim.Height; row++)
                for (int col = claim.Col; col < claim.Col + claim.Width; col++)
                    grid[row, col] = grid[row, col] == '.' ? '@' : 'x';
        }

        int overlaps = 0;
        for (int row = 0; row < grid.GetLength(0); row++)
            for (int col = 0; col < grid.GetLength(1); col++)
                if (grid[row, col] == 'x') overlaps++;
        System.Console.WriteLine($"Part 1: {overlaps}");

        foreach (var claim in claims)
        {
            for (int row = claim.Row; row < claim.Row + claim.Height; row++)
                for (int col = claim.Col; col < claim.Col + claim.Width; col++)
                    if (grid[row, col] == 'x') goto End;
            Console.WriteLine(claim.Id); 
            break;
            End: {}
        }
    }
}
