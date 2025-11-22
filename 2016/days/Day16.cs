using System.Text;
using System.Text.RegularExpressions;

namespace _2016.days;
public static class Day16
{
    public static void Run()
    {
        string bin = File.ReadAllText("inputs/day16.txt");
        Console.WriteLine($"Part 1: {GenerateChecksum(272, bin)}");
        Console.WriteLine($"Part 2: {GenerateChecksum(35651584, bin)}");
    }

    private static string GenerateChecksum(int diskSize, string bin)
    {
       while (bin.Length < diskSize)
        {
            bin = Expand(bin);
        }
        bin = bin[..diskSize]; 
        return IterateChecksum(bin);
    }

    private static string Expand(string a)
    {
        char[] bChars = [.. a.Reverse()];
        for (int i = 0; i < bChars.Length; i++)
            bChars[i] = bChars[i] == '0' ? '1' : '0';
        return a + '0' + new string(bChars);
    }

    private static string IterateChecksum(string bin)
    {
        StringBuilder sb = new();
        for (int i = 0; i < bin.Length; i += 2)
        {
            sb.Append(bin[i] == bin[i + 1] ? '1' : '0');
        }
        string checksum = sb.ToString();
        return checksum.Length % 2 == 0 ? IterateChecksum(checksum) : checksum;
    }
}
        