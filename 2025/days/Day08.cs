using System.Diagnostics;
using System.Numerics;

namespace _2025.days;

public record struct Connection(Vector3 A, Vector3 B, double Distance);

public static class Day08
{
    public static void Run()
    {
        Vector3[] junctionBoxes = [.. File.ReadAllLines("inputs/day08.txt").Select(line =>
        {
            int[] sp = [.. line.Split(',').Select(num => int.Parse(num))];
            return new Vector3(sp[0], sp[1], sp[2]);
        })];
        List<Connection> connections = [];
        for (int i = 0; i < junctionBoxes.Length - 1; i++)
            for (int j = i + 1; j < junctionBoxes.Length; j++)
                connections.Add(new Connection(junctionBoxes[i], junctionBoxes[j], GetDist(junctionBoxes[i], junctionBoxes[j])));
        connections = [.. connections.OrderBy(connection => connection.Distance)];
        Console.WriteLine($"there are {connections.Count} connections");

        List<int> groupSizes = GetGroupSizes(connections, 1000, junctionBoxes);
        Console.WriteLine($"Part 1: {groupSizes[..3].Aggregate(1, (acc, curr) => acc * curr)}");

        // manual binary search to find connection that causes one big group
        int connectionCount = 4872;
        // Console.WriteLine(GetGroupSizes(connections, connectionCount, junctionBoxes).Count);
        System.Console.WriteLine(connections[connectionCount - 1]);
        Console.WriteLine($"Part 2: {connections[connectionCount - 1].A.X * connections[connectionCount - 1].B.X}");
    }

    private static List<int> GetGroupSizes(List<Connection> connections, int numConnections, Vector3[] junctionBoxes)
    {
       Dictionary<Vector3, int> groups = [];
        
        for (int i = 0; i < numConnections; i++)
        {
            var connection = connections[i];

            if (groups.TryGetValue(connection.A, out int updateFrom) && groups.TryGetValue(connection.B, out int updateTo))
            {
                // joining two groups
                foreach (var group in groups)
                    if (group.Value == updateFrom) groups[group.Key] = updateTo;
            }
            // joining box to existing group
            else if (groups.TryGetValue(connection.A, out int a)) groups[connection.B] = a;
            else if (groups.TryGetValue(connection.B, out int b)) groups[connection.A] = b;
            else
            {
                // new group
                groups[connection.A] = i;
                groups[connection.B] = i;
            }
        }
        List<int> groupSizes = [.. groups.Values
            .GroupBy(val => val)
            .Select(g => g.Count())
            .OrderByDescending(g => g)];
        
        int ungrouped = junctionBoxes.Length - groups.Keys.Count;
        for (int i = 0; i < ungrouped; i++)
            groupSizes.Add(1);
        return groupSizes;
    }

    private static double GetDist(Vector3 a, Vector3 b)
    {
        return Math.Sqrt(Math.Pow(a.X - b.X, 2) + Math.Pow(a.Y - b.Y, 2) + Math.Pow(a.Z - b.Z, 2));
    }
}
