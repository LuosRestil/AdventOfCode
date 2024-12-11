import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;
import java.util.stream.Collectors;

public class Day09 {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner scanner = new Scanner(new File("src/inputs/Day09.txt"));
        List<List<Integer>> heightMap = new ArrayList<>();
        while (scanner.hasNextLine()) {
            heightMap.add(Arrays.stream(scanner.nextLine().split("")).map(Integer::parseInt).collect(Collectors.toList()));
        }
        scanner.close();

        List<Integer> lowSpots = new ArrayList<>();

        for (int i = 0; i < heightMap.size(); i++) {
            for (int j = 0; j < heightMap.get(0).size(); j++) {
                List<Integer> neighbors = new ArrayList<>();
                if (i > 0) {
                    neighbors.add(heightMap.get(i - 1).get(j));
                }
                if (i < heightMap.size() - 1) {
                    neighbors.add(heightMap.get(i + 1).get(j));
                }
                if (j > 0) {
                    neighbors.add(heightMap.get(i).get(j - 1));
                }
                if (j < heightMap.get(0).size() - 1) {
                    neighbors.add(heightMap.get(i).get(j + 1));
                }

                int currentValue = heightMap.get(i).get(j);
                if (neighbors.stream().allMatch(num -> num > currentValue)) {
                    lowSpots.add(currentValue);
                }
            }
        }
        System.out.println("Answer1: " + (lowSpots.stream().mapToInt(Integer::intValue).sum() + lowSpots.size()));

        List<Integer> basinSizes = new ArrayList<>();

        for (int i = 0; i < heightMap.size(); i++) {
            for (int j = 0; j < heightMap.get(0).size(); j++) {
                int currentValue = heightMap.get(i).get(j);
                if (currentValue != -1 && currentValue != 9) {
                    basinSizes.add(exploreBasin(heightMap, i, j));
                }
            }
        }

        basinSizes.sort((a, b) -> b - a);

        System.out.println("Answer2: " + (basinSizes.get(0) * basinSizes.get(1) * basinSizes.get(2)));
    }

    public static int exploreBasin(List<List<Integer>> heightMap, int row, int col) {
        int basinSize = 1;
        heightMap.get(row).set(col, -1);

        if (row > 0 && heightMap.get(row - 1).get(col) != -1 && heightMap.get(row - 1).get(col) != 9) {
            basinSize += exploreBasin(heightMap, row - 1, col);
        }
        if (row < heightMap.size() - 1 && heightMap.get(row + 1).get(col) != -1 && heightMap.get(row + 1).get(col) != 9) {
            basinSize += exploreBasin(heightMap, row + 1, col);
        }
        if (col > 0 && heightMap.get(row).get(col - 1) != -1 && heightMap.get(row).get(col - 1) != 9) {
            basinSize += exploreBasin(heightMap, row, col - 1);
        }
        if (col < heightMap.get(0).size() - 1 && heightMap.get(row).get(col + 1) != -1 && heightMap.get(row).get(col + 1) != 9) {
            basinSize += exploreBasin(heightMap, row, col + 1);
        }

        return basinSize;
    }
}
