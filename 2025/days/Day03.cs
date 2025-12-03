namespace _2025.days;

public static class Day03
{
    public static void Run()
    {
        string[] banks = File.ReadAllLines("inputs/day03.txt");
        long[] totals = [0, 0];
        foreach (string bank in banks)
        {
            totals[0] += long.Parse(GetLargestPossibleNumber(bank, 2));
            totals[1] += long.Parse(GetLargestPossibleNumber(bank, 12));
        }
        Console.WriteLine($"Part 1: {totals[0]}");
        Console.WriteLine($"Part 2: {totals[1]}");
    }

    private static string GetLargestPossibleNumber(string bank, int digits)
    {
        if (digits == 0) return "";
        char leadingDigit = bank[..(bank.Length - (digits - 1))].Max();
        int idx = bank.IndexOf(leadingDigit);
        return leadingDigit + GetLargestPossibleNumber(bank[(idx + 1)..], digits - 1);
    }
}
