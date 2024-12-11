import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Day13 {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner scanner = new Scanner(new File("src/inputs/Day13.txt"));
        List<String> input = new ArrayList<>();
        while (scanner.hasNextLine()) {
            input.add(scanner.nextLine());
        }
        scanner.close();

        int indexOfBreak = input.indexOf("");

        List<int[]> dots = input.subList(0, indexOfBreak).stream().map(line -> Arrays.stream(line.split(",")).map(Integer::parseInt).mapToInt(Integer::intValue).toArray()).collect(Collectors.toList());
        List<String[]> instructions = input.subList(indexOfBreak + 1, input.size()).stream().map(line -> line.split(" ")[2].split("=")).collect(Collectors.toList());

        int maxX = 0;
        int maxY = 0;
        for (int[] pair : dots) {
            if (pair[0] > maxX) {
                maxX = pair[0];
            }
            if (pair[1] > maxY) {
                maxY = pair[1];
            }
        }

        List<List<Character>> grid = new ArrayList<>();
        for (int i = 0; i < maxY + 1; i++) {
            grid.add(new ArrayList<>());
            for (int j = 0; j < maxX + 1; j++) {
                grid.get(i).add(' ');
            }
        }

        for (int[] pair : dots) {
            grid.get(pair[1]).set(pair[0], '*');
        }

        // Pt. 1
//        for (String[] instruction : instructions.subList(0, 1)) {
        // Pt. 2
        for (String[] instruction : instructions) {

            int subtractionFactor = 2;

            if (instruction[0].equals("x")) {
                for (int i = 0; i < grid.size(); i++) {
                    for (int j = Integer.parseInt(instruction[1]) + 1; j < grid.get(0).size(); j++) {
                        if (grid.get(i).get(j) == '*') {
                            grid.get(i).set(j - subtractionFactor, '*');
                        }
                        subtractionFactor += 2;
                    }
                    subtractionFactor = 2;
                }
                grid = grid.stream().map(row -> row.subList(0, Integer.parseInt(instruction[1]))).collect(Collectors.toList());
            }

            if (instruction[0].equals("y")) {
                for (int i = Integer.parseInt(instruction[1]) + 1; i < grid.size(); i++) {
                    for (int j = 0; j < grid.get(0).size(); j++) {
                        if (grid.get(i).get(j) == '*') {
                            grid.get(i - subtractionFactor).set(j, '*');
                        }
                    }
                    subtractionFactor += 2;
                }
                grid = grid.subList(0, Integer.parseInt(instruction[1]));
            }
        }

        // Pt. 1 only
//        int total = 0;
//        for (List<Character> row : grid) {
//            for (Character col : row) {
//                if (col == '*') {
//                    total++;
//                }
//            }
//        }
//        System.out.println("Answer1: " + total);

        System.out.println("Answer 2:");
        for (List<Character> row : grid) {
            System.out.println(row.stream().map(String::valueOf).collect(Collectors.joining()));
        }
    }
}
