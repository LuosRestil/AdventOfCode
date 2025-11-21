using System.Text;
using System.Security.Cryptography;
using _2016.common;

namespace _2016.days;
public static class Day05
{
    const string FIVE_ZEROES = "00000";
    public static void Run()
    {
        string doorId = File.ReadAllText("inputs/day05.txt");
        int idx = 0;
        int charIdx = 0;
        char[] password = new char[8];

        while (charIdx < 8)
        {
            string hash = MD5Utils.Hash(doorId + idx.ToString());
            if (hash.StartsWith(FIVE_ZEROES))
            {
                password[charIdx] = hash[5];
                charIdx++;
            }
            idx++;
        }
        Console.WriteLine($"Part 1: {string.Join(null, password)}");

        idx = 0;
        password = new char[8];
        HashSet<int> seen = [];
        while (seen.Count < 8)
        {
            string hash = MD5Utils.Hash(doorId + idx.ToString());
            if (hash.StartsWith(FIVE_ZEROES))
            {
                int pos = hash[5] - 48;
                if (pos >= 0 && pos <= 7 && !seen.Contains(pos))
                {
                    password[pos] = hash[6];
                    seen.Add(pos);
                }
            }
            idx++;
        }
        Console.WriteLine($"Part 2: {string.Join(null, password)}");
    }
}
