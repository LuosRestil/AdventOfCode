import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Coord {
    public final int row, col;

    Coord(int row, int col) {
        this.row = row;
        this.col = col;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Coord))
            return false;
        Coord coord = (Coord) o;
        return row == coord.row && col == coord.col;
    }

    @Override
    public int hashCode() {
        return 31 * row + col;
    }
}

class Guard {
    public int[] pos;
    public String dir;

    Guard(int[] pos, String dir) {
        this.pos = pos;
        this.dir = dir;
    }
}

public class Day06_2 {
    public static final Map<String, int[]> nextPosMods = Map.of(
            "^", new int[] { -1, 0 },
            "v", new int[] { 1, 0 },
            "<", new int[] { 0, -1 },
            ">", new int[] { 0, 1 });
    public static final Map<String, String> turns = Map.of(
            "^", ">",
            "v", "<",
            "<", "^",
            ">", "v");
    public static final String filepath = "inputs/day06.txt";

    public static void main(String[] args) throws IOException {
        final long start = System.currentTimeMillis();

        var path = runPt1();
        List<Coord> keys = new ArrayList<Coord>(path.keySet());
        System.out.println(String.format("Part 1: %d", keys.size()));

        runPt2(keys);

        final long end = System.currentTimeMillis();
        System.out.println(String.format("Time: %dms", end - start));
    }

    public static Map<Coord, List<String>> runPt1() throws IOException {
        List<List<String>> grid = getGrid();
        return solve(grid);
    }

    public static void runPt2(List<Coord> trodden) throws IOException {
        List<List<String>> grid = getGrid();
        Guard guard = getGuard(grid);
        var count = 0;
        for (var coord : trodden) {
            if (coord.row == guard.pos[0] && coord.col == guard.pos[1]) {
                continue;
            }

            grid.get(coord.row).set(coord.col, "#");
            var completed = solve(grid);
            if (completed == null) {
                count++;
            }
            grid.get(coord.row).set(coord.col, ".");
        }
        System.out.println(String.format("Part 2: %d", count));
    }

    public static List<List<String>> getGrid() throws IOException {
        List<List<String>> grid = new ArrayList<>();
        BufferedReader br = new BufferedReader(new FileReader(filepath));
        String line;
        while ((line = br.readLine()) != null) {
            grid.add(new ArrayList<>(Arrays.asList(line.split(""))));
        }
        br.close();
        return grid;
    }

    public static Map<Coord, List<String>> solve(List<List<String>> grid) {
        Guard guard = getGuard(grid);
        Map<Coord, List<String>> path = new HashMap<>();
        path.put(new Coord(guard.pos[0], guard.pos[1]), new ArrayList<>(List.of("^")));
        while (isInGrid(grid, guard.pos)) {
            if (!tick(grid, guard, path)) {
                return null;
            }
        }
        return path;
    }

    public static Guard getGuard(List<List<String>> grid) {
        for (int i = 0; i < grid.size(); i++) {
            for (int j = 0; j < grid.get(0).size(); j++) {
                if (grid.get(i).get(j).equals("^")) {
                    return new Guard(new int[] { i, j }, "^");
                }

            }
        }
        return null;
    }

    public static boolean isInGrid(List<List<String>> grid, int[] pos) {
        return pos[0] >= 0 && pos[0] < grid.size() && pos[1] >= 0 && pos[1] < grid.get(0).size();
    }

    public static boolean tick (List<List<String>> grid, Guard guard, Map<Coord, List<String>> path) {
        move(grid, guard);
        var pathKey = new Coord(guard.pos[0], guard.pos[1]);
        var val = path.get(pathKey);
        if (val != null && val.contains(guard.dir)) {
            return false;
        }
        if (isInGrid(grid, guard.pos)) {
            if (val == null) {
                path.put(pathKey, new ArrayList<>());
            }
            path.get(pathKey).add(guard.dir);
        }
        return true;
    }

    public static void move(List<List<String>> grid, Guard guard) {
        var nextPosMod = nextPosMods.get(guard.dir);
        var nextPos = new int[]{guard.pos[0] + nextPosMod[0], guard.pos[1] + nextPosMod[1]};
        if (isInGrid(grid, nextPos) && grid.get(nextPos[0]).get(nextPos[1]).equals("#")) {
            guard.dir = turns.get(guard.dir);
        } else {
            guard.pos = nextPos;
        }
    }
}
