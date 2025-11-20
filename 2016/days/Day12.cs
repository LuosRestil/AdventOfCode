namespace _2016.days;

public class Instruction
{
    public required string Opcode { get; set; }
    public char? CharVal1 { get; set; }
    public int? IntVal1 { get; set; }
    public char? CharVal2 { get; set; }
    public int? IntVal2 { get; set; }
}

public static class Day12
{
    public static void Run()
    {
        Instruction[] instructions = [.. File.ReadAllLines("inputs/day12.txt").Select(ParseLine)];
        Console.WriteLine($"Part 1: {RunInstructions(instructions, 0)}");
        Console.WriteLine($"Part 2: {RunInstructions(instructions, 1)}");
    }

    private static int RunInstructions(Instruction[] instructions, int registerCStartVal)
    {
        int ptr = 0;
        Dictionary<char, int> registers = new() { { 'a', 0 }, { 'b', 0 }, { 'c', registerCStartVal }, { 'd', 0 } };
        while (ptr < instructions.Length)
        {
            Instruction instruction = instructions[ptr++];
            if (instruction.Opcode == "cpy")
            {
                registers[instruction.CharVal2!.Value] = instruction.IntVal1 != null ? instruction.IntVal1.Value : registers[instruction.CharVal1!.Value];
            }
            else if (instruction.Opcode == "inc")
            {
                registers[instruction.CharVal1!.Value]++;
            }
            else if (instruction.Opcode == "dec")
            {
                registers[instruction.CharVal1!.Value]--;
            }
            else if (instruction.Opcode == "jnz")
            {
                bool jump = false;
                if (instruction.IntVal1 != null)
                    jump = instruction.IntVal1.Value != 0;
                else if (instruction.CharVal1 != null)
                    jump = registers[instruction.CharVal1.Value] != 0;
                if (jump)
                {
                    ptr--;
                    var dist = instruction.IntVal2 != null ? instruction.IntVal2.Value : registers[instruction.CharVal2!.Value];
                    ptr += dist;
                }
            }
        }
        return registers['a'];
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
