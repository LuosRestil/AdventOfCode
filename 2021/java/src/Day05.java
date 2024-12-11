import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Day05 {
    public static void main(String[] args) throws FileNotFoundException {
        // Part 1
        Scanner scanner = new Scanner(new File("src/inputs/Day06.txt"));
        List<String> data = new ArrayList<>();
        while (scanner.hasNextLine()) {
            data.add(scanner.nextLine());
        }
        scanner.close();

        int gridSize = 1000;

        int[][] grid = new int[gridSize][gridSize];
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                grid[i][j] = 0;
            }
        }

        for (String line : data) {
            String[] startAndEnd = line.split(" -> ");
            String[] start = startAndEnd[0].split(",");
            String[] end = startAndEnd[1].split(",");
            int startRow = Integer.parseInt(start[1]);
            int startCol = Integer.parseInt(start[0]);
            int endRow = Integer.parseInt(end[1]);
            int endCol = Integer.parseInt(end[0]);

            if (startRow == endRow) {
                for (int i = Math.min(startCol, endCol); i <= Math.max(startCol, endCol); i++) {
                    grid[startRow][i]++;
                }
            } else if (startCol == endCol) {
                for (int i = Math.min(startRow, endRow); i <= Math.max(startRow, endRow); i++) {
                    grid[i][startCol]++;
                }
            } else {
                // Part 2
                int row = startRow;
                int col = startCol;
                while (true) {
                    grid[row][col]++;
                    if (row == endRow && col == endCol) {
                        break;
                    }
                    row += startRow < endRow ? 1 : -1;
                    col += startCol < endCol ? 1 : -1;
                }
            }
        }

        int overlapPoints = 0;
        for (int[] row : grid) {
            for (int num : row) {
                if (num > 1) {
                    overlapPoints++;
                }
            }
        }

        System.out.println("Answer: " + overlapPoints);
    }
}
