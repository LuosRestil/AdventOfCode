namespace _2016.days;

public static class Day10
{
    public static void Run()
    {
        string[] lines = File.ReadAllLines("inputs/day10.txt");
        List<string> instructions = [.. lines];

        int lowChipTarget = 17;
        int highChipTarget = 61;

        Dictionary<string, int?[]> bots = [];
        int?[] output = new int?[21];

        while (instructions.Count > 0)
        {
            for (int i = instructions.Count - 1; i >= 0; i--)
            {
                string instruction = instructions[i];
                string[] parts = instruction.Split(' ');
                if (instruction.StartsWith("value"))
                {
                    int chipId = int.Parse(parts[1]);
                    string botId = parts[5];
                    GiveChipToBot(botId, chipId, bots);
                    instructions.RemoveAt(i);
                }
                else
                {
                    string botId = parts[1];
                    string lowDest = parts[6];
                    string highDest = parts[11];

                    bool lowToOut = parts[5] == "output";
                    bool highToOut = parts[10] == "output";

                    if (bots.TryGetValue(botId, out int?[]? chips))
                    {
                        if (chips[0] == null || chips[1] == null) continue;

                        int lowChip = (int)(chips[0] < chips[1] ? chips[0] : chips[1]);
                        int highChip = (int)(lowChip == chips[0] ? chips[1] : chips[0]);
                        if (lowChip == lowChipTarget && highChip == highChipTarget)
                        {
                            Console.WriteLine($"Part 1: {botId}");
                        }
                        if (lowToOut)
                            output[int.Parse(lowDest)] = lowChip;
                        else
                            GiveChipToBot(lowDest, lowChip, bots);

                        if (highToOut)
                            output[int.Parse(highDest)] = highChip;
                        else
                            GiveChipToBot(highDest, highChip, bots);

                        instructions.RemoveAt(i);
                    }
                }
            }
        }
        Console.WriteLine($"Part 2: {output[0] * output[1] * output[2]}"); 
    }

    private static void GiveChipToBot(string botId, int chipId, Dictionary<string, int?[]> bots)
    {
        if (!bots.ContainsKey(botId))
            bots[botId] = new int?[2];
        int emptySlot = bots[botId][0] == null ? 0 : 1;
        bots[botId][emptySlot] = chipId;
    }
}
