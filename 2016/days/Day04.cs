namespace _2016.days;
public static class Day04
{
    public static void Run()
    {
        var lines = File.ReadLines("inputs/day04.txt");
        Console.WriteLine($"Part 1: {lines.Select(GetSectorId).Sum()}");
    }

    private static int GetSectorId(string room)
    {
        List<string> sections = [.. room.Split("-")];
        string name = string.Join("-", sections[..^1]);
        string lastSection = sections[^1];
        int checksumIdx = lastSection.IndexOf('[');
        int sectorId = int.Parse(lastSection[..checksumIdx]);
        string checksum = lastSection[(checksumIdx + 1)..^1];
        if (checksum == GetTopFive(name))
        {
            string decoded = Decode(name, sectorId);
            Console.WriteLine($"{decoded} : {sectorId}");
            return sectorId;
        }
        return 0;
    }

    private static string GetTopFive(string name)
    {
        Dictionary<char, int> counts = [];
        foreach (char c in name)
        {
            if (c == '-') continue;
            if (!counts.ContainsKey(c))
                counts[c] = 0;
            counts[c]++;
        }
        var top5 = counts.ToList()
            .OrderByDescending(pair => pair.Value)
                .ThenBy(pair => pair.Key)
            .Take(5)
            .Select(pair => pair.Key);
        return string.Join(null, top5);
    }

    public static string Decode(string name, int sectorId)
    {
        // a = 97, z = 122
        int rotations = sectorId % 26;
        var shifted = name
            .ToCharArray()
            .Select(c => c == '-' ? ' ' : c + rotations)
            .Select(c => (char)(c > 122 ? c - 26 : c));
        return string.Join("", shifted);
    }
}
