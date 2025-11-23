namespace _2016.days;

public static class Day19
{
    public static void Run()
    {
        int numElves = 3014387;
        int ans = 1;
        for (int i = 4; i < numElves; i++)
        {
            if (ans == i) ans = 1;
            else ans += 2;
        }
        Console.WriteLine($"Part 1: {ans}");

        // for (int i = 5; i < 250; i++)
        //     System.Console.WriteLine($"{i} => {Solve(i)}");
        Console.WriteLine($"Part 2: {Solve(numElves)}");

    }

    private static int Solve(int numElves)
    {
        List<int> elves = [];
        for (int i = 0; i < numElves; i++)
        {
            elves.Add(i + 1);
        }

        int elf = 0;
        while (elves.Count > 1)
        {
            int target = (int)Math.Floor((elf + (elves.Count / 2.0)) % elves.Count);
            // Console.WriteLine($"elf {elves[elf]} takes out {elves[target]}");
            elves.RemoveAt(target);
            elf++;
            if (elf >= elves.Count)
                elf = 0;
        }
        return elves[0];
    }
}
