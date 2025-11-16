using System.Diagnostics;
using _2016.days;

long start = Stopwatch.GetTimestamp();

// Day01.Run();
// Day02.Run();
// Day03.Run();
// Day04.Run();
// Day05.Run();
Day06.Run();

TimeSpan elapsed = Stopwatch.GetElapsedTime(start);
Console.WriteLine(elapsed.TotalMilliseconds + "ms");
