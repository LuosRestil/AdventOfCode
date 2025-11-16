using System.Text.RegularExpressions;

namespace _2016.days;
public static partial class Day07
{
    public static void Run()
    {
        var lines = File.ReadLines("inputs/day07.txt");
        Console.WriteLine($"Part 1: {lines.Count(SupportsTls)}");
        Console.WriteLine($"Part 2: {lines.Count(SupportsSsl)}");
    }

    private static bool SupportsTls(string ip)
    {
        MatchCollection hypernetMatches = HypernetRegex().Matches(ip);
        foreach (Match hypernetMatch in hypernetMatches)
            if (HasAbba(hypernetMatch.Groups[1].ToString()))
                return false;
        return HasAbba(ip);
    }

    private static bool HasAbba(string str)
    {
        for (int i = 0; i < str.Length - 3; i++)
            if (str[i] == str[i + 3] && str[i + 1] == str[i + 2] && str[i] != str[i + 1])
                return true;
        return false;
    }

    private static bool SupportsSsl(string ip)
    {
        MatchCollection supernetMatches = SupernetRegex().Matches(ip);
        HashSet<string> supernetAbas = [];
        foreach (Match supernetMatch in supernetMatches)
        {
            var abas = GetAbas(supernetMatch.Groups[0].ToString());
            supernetAbas.UnionWith(abas);
        }

        MatchCollection hypernetMatches = HypernetRegex().Matches(ip);
        HashSet<string> hypernetAbas = [];
        foreach (Match hypernetMatch in hypernetMatches)
        {
            var abas = GetAbas(hypernetMatch.Groups[1].ToString());
            hypernetAbas.UnionWith(abas);
        }

        foreach (var aba in supernetAbas)
        {
            string inverse = $"{aba[1]}{aba[0]}{aba[1]}";
            if (hypernetAbas.Contains(inverse))
                return true;
        }
        return false;
    }

    private static HashSet<string> GetAbas(string str)
    {
        HashSet<string> abas = [];
        for (int i = 0; i < str.Length - 2; i++) {
            if (str[i] == str[i + 2] && str[i+1] != str[i])
                abas.Add(str[i..(i+3)]);
        }
        return abas;
    }

    [GeneratedRegex(@"\[([^\]]*)\]")]
    private static partial Regex HypernetRegex();

    [GeneratedRegex(@"(?<=^|\])[^\[]+")]
    private static partial Regex SupernetRegex();
}
