using System.Diagnostics;
using _2018.days;

long start = Stopwatch.GetTimestamp();

// Day01.Run();
// Day02.Run();
Day03.Run();


TimeSpan elapsed = Stopwatch.GetElapsedTime(start);
Console.WriteLine(elapsed.TotalMilliseconds + "ms");