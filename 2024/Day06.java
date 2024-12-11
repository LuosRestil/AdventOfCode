import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.security.KeyException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

class Day06 {
    public static final Map<Character, int[]> nextPosMods = Map.of(
            '^', new int[] { -1, 0 },
            'v', new int[] { 1, 0 },
            '<', new int[] { 0, -1 },
            '>', new int[] { 0, 1 });
    public static final Map<Character, Character> turns = Map.of(
            '^', '>',
            'v', '<',
            '<', '^',
            '>', 'v');
    public static final String filepath = "inputs/day06.txt";

    public static void main(String[] args) throws IOException, KeyException {
        final long start = System.currentTimeMillis();

        List<List<Character>> p1Grid = runPt1();
        System.out.println(String.format("Part 1: %d", countTrodden(p1Grid)));

        List<int[]> trodden = new ArrayList<>();
        for (int i = 0; i < p1Grid.size(); i++) {
            for (int j = 0; j < p1Grid.get(0).size(); j++) {
                trodden.add(new int[] { i, j });
            }
        }
        runPt2(trodden);

        final long end = System.currentTimeMillis();
        System.out.println(String.format("Time: %dms", end - start));
    }

    public static List<List<Character>> runPt1() throws IOException, KeyException {
        var grid = makeGrid();
        solve(grid);
        return grid;
    }

    public static void runPt2(List<int[]> trodden) throws IOException, KeyException {
        var grid = makeGrid();
        var guardPos = getGuardPos(grid);
        int count = 0;
        for (var pos : trodden) {
            if (pos[0] == guardPos[0] && pos[1] == guardPos[1])
                continue;
            var copy = deepCopy(grid);
            copy.get(pos[0]).set(pos[1], '#');
            boolean completed = solve(copy);
            if (!completed) count++;
        }
        System.out.println(String.format("Part 2: %d", count));
    }

    public static List<List<Character>> makeGrid() throws IOException {
        List<List<Character>> grid = new ArrayList<>();
        BufferedReader br = new BufferedReader(new FileReader(filepath));
        String line;
        while ((line = br.readLine()) != null) {
            grid.add(line.chars()
                    .mapToObj(e -> (char) e)
                    .collect(Collectors.toList()));
        }
        br.close();
        return grid;
    }

    public static boolean solve(List<List<Character>> grid) throws KeyException {
        int[] guardPos = getGuardPos(grid);
        Map<String, List<Character>> path = new HashMap<>();
        while (isInGrid(grid, guardPos)) {
            if (!tick(grid, guardPos, path))
                return false;
        }
        return true;
    }

    public static boolean tick(List<List<Character>> grid, int[] pos, Map<String, List<Character>> path) {
        char dir = grid.get(pos[0]).get(pos[1]);
        move(grid, pos, dir);
        String pathKey = String.format("%d:%d", pos[0], pos[1]);
        if (path.containsKey(pathKey) &&
                path.get(pathKey).contains(grid.get(pos[0]).get(pos[1])))
            return false;

        try {
            if (!path.containsKey(pathKey))
                path.put(pathKey, new ArrayList<>());
            path.get(pathKey).add(grid.get(pos[0]).get(pos[1]));
        } catch (Exception e) {
        }

        return true;
    }

    public static void move(List<List<Character>> grid, int[] pos, char dir) {
        int[] nextPosMod = nextPosMods.get(dir);
        int[] nextPos = new int[] { pos[0] + nextPosMod[0], pos[1] + nextPosMod[1] };
        boolean hasTurned = false;
        if (isInGrid(grid, nextPos)) {
            if (grid.get(nextPos[0]).get(nextPos[1]) == '#') {
                grid.get(pos[0]).set(pos[1], turns.get(dir));
                hasTurned = true;
            } else {
                grid.get(nextPos[0]).set(nextPos[1], dir);
            }
        }

        if (!hasTurned) {
            pos[0] = nextPos[0];
            pos[1] = nextPos[1];
        }
    }

    public static int[] getGuardPos(List<List<Character>> grid) throws KeyException {
        for (int i = 0; i < grid.size(); i++) {
            for (int j = 0; j < grid.get(0).size(); j++) {
                if (grid.get(i).get(j) == '^')
                    return new int[] { i, j };
            }
        }
        throw new KeyException("Unable to find guard");
    }

    public static boolean isInGrid(List<List<Character>> grid, int[] pos) {
        return pos[0] >= 0 && pos[0] < grid.size() && pos[1] >= 0 && pos[1] < grid.get(0).size();
    }

    public static int countTrodden(List<List<Character>> grid) {
        int count = 0;
        for (var row : grid) {
            for (var col : row) {
                if (turns.containsKey(col))
                    count++;
            }
        }
        return count;
    }

    public static List<List<Character>> deepCopy(List<List<Character>> grid) {
        List<List<Character>> dest = new ArrayList<>();
        for (var row : grid) {
            dest.add(new ArrayList<>(row));
        }
        return dest;
    }
}