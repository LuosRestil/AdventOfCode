using _2016.common.math;

namespace _2016.days;

public record struct BotNode(Vec2 Pos, string Seen, int Steps, char LastCollected);
public record struct BotMapKey(Vec2 Pos, string Seen);

public static class Day24
{
    private static Dictionary<BotMapKey, int> botmap = [];
    private static string[] grid = [];

    public static void Run()
    {
        grid = File.ReadAllLines("inputs/day24.txt");

        Dictionary<char, Vec2> numPos = GetNumPos(grid);
        Dictionary<char, int> distToZero = GetDistToZero(numPos, grid);

        var pt1 = int.MaxValue;
        var pt2 = int.MaxValue;
        BotNode start = new(numPos['0'], "0", 0, '0');
        List<BotNode> queue = [start];
        while (queue.Count > 0)
        {
            var node = queue[0];
            queue.RemoveAt(0);

            if (node.Seen.Length == 8)
            {
                if (node.Steps < pt1)
                    pt1 = node.Steps;
                if (node.Steps + distToZero[node.LastCollected] < pt2) 
                    pt2 = node.Steps + distToZero[node.LastCollected];
            }

            var neighbors = GetNeighbors(node, grid);
            queue.AddRange(neighbors);
        }

        Console.WriteLine($"Part 1: {pt1}");
        Console.WriteLine($"Part 2: {pt2}");
    }

    private static List<BotNode> GetNeighbors(BotNode node, string[] grid)
    {
        List<BotNode> neighbors = [];
        Vec2[] toCheck = [
            new(node.Pos.X, node.Pos.Y - 1),
            new(node.Pos.X, node.Pos.Y + 1),
            new(node.Pos.X - 1, node.Pos.Y),
            new(node.Pos.X + 1, node.Pos.Y)
        ];
        foreach (var checkPos in toCheck)
        {
            BotNode? neighbor = CheckNeighbor(checkPos, node);
            if (neighbor != null) neighbors.Add(neighbor.Value);
        }

        return neighbors;
    }

    private static BotNode? CheckNeighbor(Vec2 checkPos, BotNode node)
    {
        var c = grid[checkPos.Y][checkPos.X];
        if (c == '#') return null;

        char lastCollected = node.LastCollected;

        string seen = node.Seen;
        if (c != '.' && !seen.Contains(c))
        {
            seen = string.Join(null, (seen + c).ToCharArray().Order());
            lastCollected = c;
        }

        int steps = node.Steps + 1;

        BotMapKey botmapKey = new(checkPos, seen);
        if (botmap.GetValueOrDefault(botmapKey, int.MaxValue) <= steps)
            return null;

        botmap[botmapKey] = steps;
        return new(checkPos, seen, steps, lastCollected);
    }

    private static Dictionary<char, Vec2> GetNumPos(string[] grid)
    {
        Dictionary<char, Vec2> numPos = [];
        for (int i = 0; i < grid.Length; i++)
        {
            for (int j = 0; j < grid[0].Length; j++)
            {
                char c = grid[i][j];
                if (c != '#' && c != '.')
                    numPos[c] = new(j, i);
            }
        }
        return numPos;
    }

    private static Dictionary<char, int> GetDistToZero(Dictionary<char, Vec2> numPos, string[] grid)
    {
        Dictionary<char, int> distToZero = [];
        foreach (var entry in numPos)
            distToZero[entry.Key] = BFS(entry.Value, numPos['0'], grid);
        return distToZero;
    }

    private static int BFS(Vec2 src, Vec2 dest, string[] grid)
    {
        List<Step> queue = [new Step(src, 0)];
        Dictionary<Vec2, int> memo = [];
        while (queue.Count > 0)
        {
            var step = queue[0];
            queue.RemoveAt(0);

            if (step.Pos == dest)
                return step.Count;

            Vec2[] neighbors = [
                new(step.Pos.X, step.Pos.Y - 1),
                new(step.Pos.X, step.Pos.Y + 1),
                new(step.Pos.X - 1, step.Pos.Y),
                new(step.Pos.X + 1, step.Pos.Y)
            ];
            foreach (var neighbor in neighbors)
            {
                if (grid[neighbor.Y][neighbor.X] != '#' && memo.GetValueOrDefault(neighbor, int.MaxValue) > step.Count + 1)
                {
                    queue.Add(new(neighbor, step.Count + 1));
                    memo[neighbor] = step.Count + 1;
                }
            }
        }
        return -1;
    }
}
