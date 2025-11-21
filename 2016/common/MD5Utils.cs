using System.Security.Cryptography;
using System.Text;

namespace _2016.common;

public static class MD5Utils
{
    private static StringBuilder? hashBuilder;

    private static StringBuilder GetHashBuilder()
    {
        hashBuilder ??= new();
        hashBuilder.Clear();
        return hashBuilder;
    }
    public static string Hash(string input)
    {
        StringBuilder hashBuilder = GetHashBuilder();
        byte[] hashArray = MD5.HashData(Encoding.UTF8.GetBytes(input));
        foreach (byte b in hashArray)
        {
            hashBuilder.Append(b.ToString("x2"));
        }
        return hashBuilder.ToString();
    }
}