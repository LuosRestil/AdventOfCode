using System.Diagnostics;
using _2016.days;

long start = Stopwatch.GetTimestamp();

// Day01.Run();
// Day02.Run();
// Day03.Run();
// Day04.Run();
// Day05.Run();
// Day06.Run();
// Day07.Run();
// Day08.Run();
// Day09.Run();
// Day10.Run();
// Day11.Run();
// Day12.Run();
Day13.Run();

TimeSpan elapsed = Stopwatch.GetElapsedTime(start);
Console.WriteLine(elapsed.TotalMilliseconds + "ms");
