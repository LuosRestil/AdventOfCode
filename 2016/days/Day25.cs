namespace _2016.days;

public static class Day25
{
    private static readonly Dictionary<string, string> tglMap = new(){
        {"jnz", "cpy"},
        {"cpy", "jnz"},
        {"inc", "dec"},
        {"dec", "inc"},
        {"tgl", "inc"},
        {"out", "inc"}
    };

    private static readonly int[] goal = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

    public static void Run()
    {
        int input = 0;
        while (true)
        {
            Instruction[] instructions = [.. File.ReadAllLines("inputs/day25.txt").Select(ParseLine)];
            bool isGoal = RunInstructions(instructions, input);
            if (isGoal) break;
            input++;
        }
        Console.WriteLine($"Part 1: {input}");
    }

    private static bool RunInstructions(Instruction[] instructions, int registerAStartVal)
    {
        int ptr = 0;
        int outIdx = 0;
        Dictionary<char, int> registers = new() { { 'a', registerAStartVal }, { 'b', 0 }, { 'c', 0 }, { 'd', 0 } };
        while (ptr < instructions.Length)
        {
            if (outIdx == goal.Length) break;

            Instruction instruction = instructions[ptr];
            bool jump = false;

            if (instruction.Opcode == "cpy")
            {
                if (instruction.CharVal2 != null)
                    registers[instruction.CharVal2!.Value] = instruction.IntVal1 != null ? instruction.IntVal1.Value : registers[instruction.CharVal1!.Value];
            }
            else if (instruction.Opcode == "inc")
            {
                if (instruction.CharVal1 != null)
                {
                    registers[instruction.CharVal1!.Value]++;

                }
            }
            else if (instruction.Opcode == "dec")
            {
                if (instruction.CharVal1 != null)
                    registers[instruction.CharVal1!.Value]--;
            }
            else if (instruction.Opcode == "jnz")
            {
                if (instruction.IntVal1 != null)
                    jump = instruction.IntVal1.Value != 0;
                else if (instruction.CharVal1 != null)
                    jump = registers[instruction.CharVal1.Value] != 0;
                if (jump)
                {
                    var dist = instruction.IntVal2 != null ? instruction.IntVal2.Value : registers[instruction.CharVal2!.Value];
                    ptr += dist;
                }
            }
            else if (instruction.Opcode == "tgl")
            {
                int dist = 0;
                if (instruction.IntVal1 != null)
                    dist = instruction.IntVal1.Value;
                else if (instruction.CharVal1 != null)
                    dist = registers[instruction.CharVal1.Value];
                int targetIdx = ptr + dist;
                if (targetIdx >= 0 && targetIdx < instructions.Length)
                    instructions[targetIdx].Opcode = tglMap[instructions[targetIdx].Opcode];
            }
            else if (instruction.Opcode == "out")
            {
                int outVal = instruction.IntVal1 != null ? instruction.IntVal1.Value : registers[instruction.CharVal1!.Value];
                if (outVal != goal[outIdx]) return false;
                outIdx++;
            }
            if (!jump) ptr++;
        }
        
        return outIdx == goal.Length;
    }

    private static Instruction ParseLine(string line)
    {
        string[] parts = line.Split(' ');
        Instruction instruction = new() { Opcode = parts[0] };
        try
        {
            instruction.IntVal1 = int.Parse(parts[1]);
        }
        catch (FormatException)
        {
            instruction.CharVal1 = parts[1][0];
        }
        if (parts.Length == 3)
        {
            try
            {
                instruction.IntVal2 = int.Parse(parts[2]);
            }
            catch (FormatException)
            {
                instruction.CharVal2 = parts[2][0];
            }
        }

        return instruction;
    }
} 