namespace _2016.common.math;

public static class MathUtils
{
    public static bool IsBetween(int val, int a, int b)
    {
        int min = Math.Min(a, b);
        int max = min == a ? b : a;
        return val >= min && val <= max;
    }
}