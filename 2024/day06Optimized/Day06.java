import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.BitSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Optimized version of Day06 solution.
 * Uses parallel streams, more efficient data structures, and algorithmic improvements.
 */
public class Day06 {
    // Direction constants for better performance
    private static final char DIR_UP = '^';
    private static final char DIR_DOWN = 'v';
    private static final char DIR_LEFT = '<';
    private static final char DIR_RIGHT = '>';
    private static final char WALL = '#';
    
    // Direction movement deltas (row, col)
    private static final int[][] DIRECTION_DELTAS = {
            {-1, 0},  // UP
            {1, 0},   // DOWN
            {0, -1},  // LEFT
            {0, 1}    // RIGHT
    };
    
    // Direction indices for fast lookup
    private static final int UP = 0;
    private static final int DOWN = 1;
    private static final int LEFT = 2;
    private static final int RIGHT = 3;
    
    // Fast direction index lookup
    private static final Map<Character, Integer> DIR_INDEX = Map.of(
            DIR_UP, UP,
            DIR_DOWN, DOWN,
            DIR_LEFT, LEFT,
            DIR_RIGHT, RIGHT
    );
    
    // Direction after turning at wall
    private static final char[] TURN_MAP = {DIR_RIGHT, DIR_LEFT, DIR_UP, DIR_DOWN}; // UP, DOWN, LEFT, RIGHT
    
    private static final String FILEPATH = "../inputs/day06.txt";
    
    // Cache for grid to avoid repeated reads
    private static char[][] gridCache = null;
    
    /**
     * Immutable coordinate class for efficient hashing and equality checks
     */
    static final class Coord {
        final short row, col;
        
        Coord(int row, int col) {
            this.row = (short) row;
            this.col = (short) col;
        }
        
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Coord)) return false;
            Coord coord = (Coord) o;
            return row == coord.row && col == coord.col;
        }
        
        @Override
        public int hashCode() {
            return 31 * row + col;
        }
    }
    
    /**
     * Optimized guard class with primitive types
     */
    static final class Guard {
        short row, col;
        char dir;
        
        Guard(int row, int col, char dir) {
            this.row = (short) row;
            this.col = (short) col;
            this.dir = dir;
        }
        
        // Create a deep copy of the guard
        Guard copy() {
            return new Guard(row, col, dir);
        }
    }
    
    public static void main(String[] args) throws IOException {
        final long start = System.currentTimeMillis();
        
        // Part 1
        var path = runPt1();
        List<Coord> keys = new ArrayList<>(path.keySet());
        System.out.println(String.format("Part 1: %d", keys.size()));
        
        // Part 2
        int count = runPt2(keys);
        System.out.println(String.format("Part 2: %d", count));
        
        final long end = System.currentTimeMillis();
        System.out.println(String.format("Time: %dms", end - start));
    }
    
    public static Map<Coord, BitSet> runPt1() throws IOException {
        char[][] grid = getGrid();
        return solve(grid);
    }
    
    /**
     * Optimized Part 2 implementation with parallel processing
     */
    public static int runPt2(List<Coord> trodden) throws IOException {
        char[][] grid = getGrid();
        Guard guard = findGuard(grid);
        
        // Create a custom thread pool with 75% of available processors
        int parallelism = Math.max(1, (int)(Runtime.getRuntime().availableProcessors() * 0.75));
        try (ForkJoinPool customThreadPool = new ForkJoinPool(parallelism)) {
            try {
                // Using AtomicInteger for thread-safe counting
                AtomicInteger count = new AtomicInteger(0);
                
                // Process coordinates in parallel
                customThreadPool.submit(() ->
                    trodden.parallelStream().forEach(coord -> {
                        // Skip guard starting position
                        if (coord.row == guard.row && coord.col == guard.col) {
                            return;
                        }
                        
                        // Create a copy of the grid for this thread
                        char[][] localGrid = copyGrid(grid);
                        
                        // Modify local grid
                        localGrid[coord.row][coord.col] = WALL;
                        
                        // Check if path is blocked
                        if (solve(localGrid) == null) {
                            count.incrementAndGet();
                        }
                    })
                ).get(); // Wait for completion
                
                return count.get();
            } catch (Exception e) {
                e.printStackTrace();
                return 0;
            } finally {
                customThreadPool.shutdown();
            }
        }
    }
    
    /**
     * Fast grid copy operation
     */
    private static char[][] copyGrid(char[][] grid) {
        char[][] copy = new char[grid.length][];
        for (int i = 0; i < grid.length; i++) {
            copy[i] = Arrays.copyOf(grid[i], grid[i].length);
        }
        return copy;
    }
    
    /**
     * Optimized grid loading with caching
     */
    public static char[][] getGrid() throws IOException {
        if (gridCache != null) {
            return copyGrid(gridCache);
        }
        
        List<String> lines = Files.readAllLines(Paths.get(FILEPATH));
        char[][] grid = new char[lines.size()][];
        
        for (int i = 0; i < lines.size(); i++) {
            grid[i] = lines.get(i).toCharArray();
        }
        
        // Cache the original grid
        gridCache = grid;
        return copyGrid(grid);
    }
    
    /**
     * Main solver with optimized data structures
     */
    public static Map<Coord, BitSet> solve(char[][] grid) {
        Guard guard = findGuard(grid);
        Map<Coord, BitSet> path = new HashMap<>(5000); // Pre-allocated capacity
        
        // Initialize starting position
        Coord startCoord = new Coord(guard.row, guard.col);
        BitSet directions = new BitSet(4);
        directions.set(UP); // Mark starting direction
        path.put(startCoord, directions);
        
        // Main solving loop
        while (isInGrid(grid, guard.row, guard.col)) {
            if (!tick(grid, guard, path)) {
                return null; // Cycle detected
            }
        }
        
        return path;
    }
    
    /**
     * Optimized guard finder
     */
    public static Guard findGuard(char[][] grid) {
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[i].length; j++) {
                if (grid[i][j] == DIR_UP) {
                    return new Guard(i, j, DIR_UP);
                }
            }
        }
        return null;
    }
    
    /**
     * Fast boundary check
     */
    public static boolean isInGrid(char[][] grid, int row, int col) {
        return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
    }
    
    /**
     * Update path tracking with optimized BitSet for direction tracking
     */
    public static boolean tick(char[][] grid, Guard guard, Map<Coord, BitSet> path) {
        move(grid, guard);
        
        // Create coord for map lookup
        Coord pathKey = new Coord(guard.row, guard.col);
        
        // Get direction index
        int dirIndex = DIR_INDEX.get(guard.dir);
        
        // Check if we've seen this position with this direction before
        BitSet directions = path.get(pathKey);
        if (directions != null && directions.get(dirIndex)) {
            return false; // Cycle detected
        }
        
        if (isInGrid(grid, guard.row, guard.col)) {
            if (directions == null) {
                directions = new BitSet(4);
                path.put(pathKey, directions);
            }
            directions.set(dirIndex);
        }
        
        return true;
    }
    
    /**
     * Optimized movement logic
     */
    public static void move(char[][] grid, Guard guard) {
        int dirIndex = DIR_INDEX.get(guard.dir);
        int[] delta = DIRECTION_DELTAS[dirIndex];
        
        int nextRow = guard.row + delta[0];
        int nextCol = guard.col + delta[1];
        
        if (isInGrid(grid, nextRow, nextCol) && grid[nextRow][nextCol] == WALL) {
            // Turn at wall
            guard.dir = TURN_MAP[dirIndex];
        } else {
            // Move forward
            guard.row = (short) nextRow;
            guard.col = (short) nextCol;
        }
    }
} 