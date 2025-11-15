using _2016.common.math;

namespace _2016.days;
public static class Day02
{
    public static void Run()
    {
        var lines = File.ReadLines("inputs/day02.txt");
        Console.WriteLine(lines.Count());
        string[] keypad = [
            "#####",
            "#123#",
            "#456#",
            "#789#",
            "#####",
        ];
        var pos = new Vec2(2, 2);
        Console.WriteLine($"Part 1: {Solve(lines, keypad, pos)}");

        keypad = [
            "#######",
            "###1###",
            "##234##",
            "#56789#",
            "##ABC##",
            "###D###",
            "#######"
        ];
        pos = new Vec2(3, 1);
        Console.WriteLine($"Part 2: {Solve(lines, keypad, pos)}");
    }

    private static string Solve(IEnumerable<string> lines, string[] keypad, Vec2 pos)
    {
        List<char> code = [];
        foreach (string line in lines)
        {
            foreach (char c in line)
            {
                if (c == 'U' && keypad[pos.Y - 1][pos.X] != '#') pos.Y--;
                else if (c == 'D' && keypad[pos.Y + 1][pos.X] != '#') pos.Y++;
                else if (c == 'L' && keypad[pos.Y][pos.X - 1] != '#') pos.X--;
                else if (c == 'R' && keypad[pos.Y][pos.X + 1] != '#') pos.X++;
            }
            code.Add(keypad[pos.Y][pos.X]);
        }
        return String.Join(null, code);
    }
}
