namespace _2018.days;

public static class Day02
{
    public static void Run()
    {
        string[] ids = File.ReadAllLines("inputs/day02.txt");
        int twos = 0;
        int threes = 0;
        foreach (var id in ids)
        {
            var charCounts = GetCharCounts(id);
            if (charCounts.ContainsValue(2)) twos++;
            if (charCounts.ContainsValue(3)) threes++;
        }
        System.Console.WriteLine($"Part 1: {twos * threes}");

        for (int i = 0; i < ids.Length - 1; i++)
        {
            for (int j = i + 1; j < ids.Length; j++)
            {
                int diff = -1;
                bool isAnswer = true;
                string a = ids[i];
                string b = ids[j];
                for (int k = 0; k < a.Length; k++)
                {
                    if (a[k] != b[k])
                    {
                        if (diff > -1)
                        {
                            isAnswer = false;
                            break;
                        }
                        diff = k;
                    }
                }
                if (isAnswer)
                {

                    Console.WriteLine($"Part 2: {a[..diff] + a[(diff + 1)..]}");
                    goto Done;
                }
            }
        }
    Done: { }
    }

    private static Dictionary<char, int> GetCharCounts(string id)
    {
        Dictionary<char, int> charCounts = [];
        foreach (char c in id)
            charCounts[c] = charCounts.GetValueOrDefault(c, 0) + 1;
        return charCounts;
    }
}
