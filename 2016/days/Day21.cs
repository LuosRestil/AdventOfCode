namespace _2016.days;

public static class Day21
{
    public static void Run()
    {
        string source = "abcdefgh";
        string[] instructions = File.ReadAllLines("inputs/day21.txt");
        Console.WriteLine($"Part 1: {Scramble(source, instructions)}");

        string target = "fbgdceah";
        List<List<char>> permutations = GetAllPermutations([.. source.ToCharArray()]);
        foreach (List<char> permutation in permutations)
        {
            if (Scramble(string.Join(null, permutation), instructions) == target)
            {
                Console.WriteLine($"Part 2: {string.Join(null, permutation)}");
                break;
            }
        }
    }

    private static string Scramble(string source, string[] instructions)
    {
        List<char> chars = [.. source.ToCharArray()];
        foreach (string line in instructions)
        {
            string[] parts = line.Split(' ');
            if (parts[0] == "swap")
            {
                if (parts[1] == "position")
                    chars = SwapPositions(int.Parse(parts[2]), int.Parse(parts[5]), chars);
                else
                    chars = SwapLetters(parts[2][0], parts[5][0], chars);
            }
            else if (parts[0] == "rotate")
            {
                if (parts[1] == "left")
                    chars = RotateLeft(int.Parse(parts[2]), chars);
                else if (parts[1] == "right")
                    chars = RotateRight(int.Parse(parts[2]), chars);
                else
                    chars = RotateBasedOnLetter(parts[6][0], chars);
            }
            else if (parts[0] == "reverse")
                chars = ReversePositions(int.Parse(parts[2]), int.Parse(parts[4]), chars);
            else // move
                chars = MovePosition(int.Parse(parts[2]), int.Parse(parts[5]), chars);
        }
        return string.Join(null, chars);
    }

    private static List<char> SwapPositions(int x, int y, List<char> chars)
    {
        (chars[y], chars[x]) = (chars[x], chars[y]);
        return chars;
    }

    private static List<char> SwapLetters(char x, char y, List<char> chars)
    {
        int a = chars.IndexOf(x);
        int b = chars.IndexOf(y);
        return SwapPositions(a, b, chars);
    }

    private static List<char> RotateRight(int steps, List<char> chars)
    {
        while (steps > chars.Count)
            steps -= chars.Count;
        return [.. chars[^steps..], .. chars[..^steps]];
    }

    private static List<char> RotateLeft(int steps, List<char> chars)
    {
        while (steps > chars.Count)
            steps -= chars.Count;
        return [.. chars[steps..], .. chars[..steps]];
    }

    private static List<char> RotateBasedOnLetter(char letter, List<char> chars)
    {
        int idx = chars.IndexOf(letter);
        int rot = 1 + idx;
        if (idx >= 4) rot++;
        return RotateRight(rot, chars);
    }

    private static List<char> ReversePositions(int start, int end, List<char> chars)
    {
        while (start < end)
        {
            SwapPositions(start, end, chars);
            start++;
            end--;
        }
        return chars;
    }

    private static List<char> MovePosition(int source, int dest, List<char> chars)
    {
        char c = chars[source];
        chars.RemoveAt(source);
        chars.Insert(dest, c);
        return chars;
    }

    private static void Print(List<char> chars)
    {
        System.Console.WriteLine(string.Join(' ', chars));
    }

    private static List<List<char>> GetAllPermutations(List<char> chars)
    {
        if (chars.Count == 1)
            return [chars];

        List<List<char>> perms = [];
        for (int i = 0; i < chars.Count; i++)
        {
            var curr = chars[i];
            var remaining = GetAllPermutations(
              [.. chars[..i], .. chars[(i + 1)..]]
            );
            foreach (var perm in remaining)
            {
                var x = new List<char>();
                x.Add(curr);
                x.AddRange(perm);
                perms.Add(x);
            }
        }

        return perms;
    }
}
