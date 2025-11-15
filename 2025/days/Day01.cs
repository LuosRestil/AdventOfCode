using System.Diagnostics;

namespace _2025.days;

public class Day01 
{
    public static void Run()
    {
        long startTime = Stopwatch.GetTimestamp();
        var lines = File.ReadLines("inputs/test.txt");
        foreach (var line in lines)
            Console.WriteLine(line);
        TimeSpan elapsedTime = Stopwatch.GetElapsedTime(startTime);
    }
}