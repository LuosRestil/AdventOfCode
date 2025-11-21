using System.Text.RegularExpressions;
using _2016.common;

namespace _2016.days;

public class HashDatum
{
    public char FirstTriplet { get; set; } = '!';
    public HashSet<char> Fives { get; set; } = [];
}

public static partial class Day14
{
    public static void Run()
    {
        string salt = File.ReadAllText("inputs/day14.txt");
        Solve(salt, false);
        Solve(salt, true);
    }

    private static void Solve(string salt, bool isPart2)
    {
        int currIdx = 0;
        int highestCheckedIdx = 0;
        int keysCount = 0;
        Dictionary<int, HashDatum> hashData = [];

        while (keysCount < 64)
        {
            if (currIdx > highestCheckedIdx)
            {
                HashDatum? hd = GetHashDatum(salt + currIdx, isPart2);
                if (hd != null) hashData[currIdx] = hd;
                highestCheckedIdx = currIdx;
            }

            if (hashData.TryGetValue(currIdx, out HashDatum? hashDatum))
            {
                hashData.Remove(currIdx);
                char triplet = hashDatum.FirstTriplet;
                for (int i = currIdx + 1; i <= currIdx + 1000; i++)
                {
                    if (i > highestCheckedIdx)
                    {
                        HashDatum? hd = GetHashDatum(salt + i, isPart2);
                        if (hd != null) hashData[i] = hd;
                        highestCheckedIdx = i;
                    }
                    
                    if (hashData.TryGetValue(i, out HashDatum? candidate) && candidate.Fives.Contains(triplet))
                    {
                        keysCount++;
                        goto KeyFound;
                    }

                }
            }
            currIdx++;
            KeyFound: {}
        }
        Console.WriteLine($"Part {(isPart2 ? '2' : '1')}: {currIdx}");
    }

    private static HashDatum? GetHashDatum(string input, bool stretch = false)
    {
        string hash = MD5Utils.Hash(input);
        if (stretch)
        {
            for (int i = 0; i < 2016; i++)
                hash = MD5Utils.Hash(hash);
        }
        Match firstTripletMatch = TripletRegex().Match(hash);
        if (firstTripletMatch.Success)
        {
            HashDatum hashDatum = new();
            hashDatum.FirstTriplet = firstTripletMatch.Groups[1].ToString()[0];
            MatchCollection quintupletMatches = QuintupletRegex().Matches(hash);
            foreach (Match quintupletMatch in quintupletMatches)
            {
                hashDatum.Fives.Add(quintupletMatch.Groups[1].ToString()[0]);
            }
            return hashDatum;
        }
        return null;
    }

    [GeneratedRegex(@"(.)\1{2}")]
    private static partial Regex TripletRegex();

    [GeneratedRegex(@"(.)\1{4}")]
    private static partial Regex QuintupletRegex();
}
