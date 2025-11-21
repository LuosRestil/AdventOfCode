using System.Security.Cryptography;
using System.Text;
using _2016.common;

namespace _2016.days;

public static class Day14
{
    public static void Run()
    {
        Console.WriteLine(MD5Utils.Hash("abc18"));
    }
}
