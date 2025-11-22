using _2016.common;
using _2016.common.math;

namespace _2016.days;

public record struct Node(Vec2 Pos, string Path);

public static class Day17
{
    public static void Run()
    {
        string passcode = File.ReadAllText("inputs/day17.txt");
        Tuple<string, string> shortestAndLongestPath = GetShortestAndLongestPath(passcode);
        Console.WriteLine($"Part 1: {shortestAndLongestPath.Item1}");
        Console.WriteLine($"Part 2: {shortestAndLongestPath.Item2.Length}");
    }

    public static Tuple<string, string> GetShortestAndLongestPath(string passcode)
    {
        Vec2 start = new(0, 0);
        Vec2 target = new(3, 3);
        string shortestPath = "";
        string longestPath = "";

        List<Node> queue = [new(start, "")];
        while (queue.Count > 0)
        {
            Node node = queue[0];
            queue.RemoveAt(0);
            if (node.Pos == target)
            {
                if (shortestPath == "") shortestPath = node.Path;
                if (node.Path.Length > longestPath.Length) longestPath = node.Path;
            }
            else
            {
                queue.AddRange(GetNeighbors(passcode, node, target));
            }
        }
        return new(shortestPath, longestPath);
    }

    public static List<Node> GetNeighbors(string passcode, Node node, Vec2 target)
    {
        string udlr = MD5Utils.Hash(passcode + node.Path)[..4];
        List<Node> neighbors = [];
        
        // up
        if (node.Pos.Y > 0 && udlr[0] >= 98)
            neighbors.Add(new(new(node.Pos.X, node.Pos.Y - 1), node.Path + 'U'));
        // down
        if (node.Pos.Y < target.Y && udlr[1] >= 98)
            neighbors.Add(new(new(node.Pos.X, node.Pos.Y + 1), node.Path + 'D'));
        // left
        if (node.Pos.X > 0 && udlr[2] >= 98)
            neighbors.Add(new(new(node.Pos.X - 1, node.Pos.Y), node.Path + 'L'));
        // right
        if (node.Pos.X < target.X && udlr[3] >= 98)
            neighbors.Add(new(new(node.Pos.X + 1, node.Pos.Y), node.Path + 'R'));

        return neighbors;
    }
}
        