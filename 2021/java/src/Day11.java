import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Day11 {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner scanner = new Scanner(new File("src/inputs/Day11.txt"));
        List<List<Integer>> grid = new ArrayList<>();
        while (scanner.hasNextLine()) {
            grid.add(Arrays.stream(scanner.nextLine().split("")).map(Integer::parseInt).collect(Collectors.toList()));
        }
        scanner.close();

        int steps = 100;
        int flashes = 0;
        // Pt. 1
//        for (int i = 0; i < steps; i++) {
        // Pt. 2
        int step = 1;
        int allFlashStep = -1;
        while (allFlashStep < 0) {
            // step 1, increment all
            for (int row = 0; row < grid.size(); row++) {
                for (int col = 0; col < grid.get(0).size(); col++) {
                    grid.get(row).set(col, grid.get(row).get(col) + 1);
                }
            }
            // step 2, flash
            for (int row = 0; row < grid.size(); row++) {
                for (int col = 0; col < grid.get(0).size(); col++) {
                    if (grid.get(row).get(col) > 9) {
                        flashes += flash(grid, row, col);
                    }
                }
            }
            // step 3, reset flashed to 0
            for (int row = 0; row < grid.size(); row++) {
                for (int col = 0; col < grid.get(0).size(); col++) {
                    if (grid.get(row).get(col) < 0) {
                        grid.get(row).set(col, 0);
                    }
                }
            }
            // Pt. 2
            if (grid.stream().allMatch(row -> row.stream().allMatch(num -> num == 0))) {
                allFlashStep = step;
            }
            step++;
        }
//        System.out.println("Answer1: " + flashes);
        System.out.println("Answer2: " + allFlashStep);
    }

    public static int flash(List<List<Integer>> grid, int row, int col) {
        int flashes = 1;
        grid.get(row).set(col, -1);

        // increment and flash neighbors
        // top
        if (row > 0 && grid.get(row - 1).get(col) >= 0) {
            int val = grid.get(row - 1).set(col, grid.get(row - 1).get(col) + 1);
            if (val >= 9) {
                flashes += flash(grid, row - 1, col);
            }
        }
        // bottom
        if (row < grid.size() - 1 && grid.get(row + 1).get(col) >= 0) {
            int val = grid.get(row + 1).set(col, grid.get(row + 1).get(col) + 1);
            if (val >= 9) {
                flashes += flash(grid, row + 1, col);
            }
        }
        // left
        if (col > 0 && grid.get(row).get(col - 1) >= 0) {
            int val = grid.get(row).set(col - 1, grid.get(row).get(col - 1) + 1);
            if (val >= 9) {
                flashes += flash(grid, row, col - 1);
            }
        }
        // right
        if (col < grid.get(0).size() - 1 && grid.get(row).get(col + 1) >= 0) {
            int val = grid.get(row).set(col + 1, grid.get(row).get(col + 1) + 1);
            if (val >= 9) {
                flashes += flash(grid, row, col + 1);
            }
        }
        // top left
        if (row > 0 && col > 0 && grid.get(row - 1).get(col - 1) >= 0) {
            int val = grid.get(row - 1).set(col - 1, grid.get(row - 1).get(col - 1) + 1);
            if (val >= 9) {
                flashes += flash(grid, row - 1, col - 1);
            }
        }
        // top right
        if (row > 0 && col < grid.get(0).size() - 1 && grid.get(row - 1).get(col + 1) >= 0) {
            int val = grid.get(row - 1).set(col + 1, grid.get(row - 1).get(col + 1) + 1);
            if (val >= 9) {
                flashes += flash(grid, row - 1, col + 1);
            }
        }
        // bottom left
        if (row < grid.size() - 1 && col > 0 && grid.get(row + 1).get(col - 1) >= 0) {
            int val = grid.get(row + 1).set(col - 1, grid.get(row + 1).get(col - 1) + 1);
            if (val >= 9) {
                flashes += flash(grid, row + 1, col - 1);
            }
        }
        // bottom right
        if (row < grid.size() - 1 && col < grid.get(0).size() - 1 && grid.get(row + 1).get(col + 1) >= 0) {
            int val = grid.get(row + 1).set(col + 1, grid.get(row + 1).get(col + 1) + 1);
            if (val >= 9) {
                flashes += flash(grid, row + 1, col + 1);
            }
        }

        return flashes;
    }
}
