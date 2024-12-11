import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Stream;

public class Day15 {
    public static void main(String[] args) throws FileNotFoundException {
        long startTime = System.currentTimeMillis();

        Scanner scanner = new Scanner(new File("src/inputs/Day15.txt"));
        List<String> inputList = new ArrayList<>();
        while (scanner.hasNextLine()) {
            inputList.add(scanner.nextLine());
        }
        scanner.close();

        String[] input = inputList.toArray(String[]::new);
        ArrayList<ArrayList<Day15Cell>> grid;
        ArrayList<Day15Cell> openSet;
        ArrayList<Day15Cell> closedSet;
        Day15Cell start;
        Day15Cell end;
        Day15Cell current;

        // Pt .2 expand grid and increment values
        input = expandInput(input);

        openSet = new ArrayList<>();
        closedSet = new ArrayList<>();

        grid = new ArrayList<>();

        for (int i = 0; i < input.length; i++) {
            String[] numStrings = input[i].split("");
            ArrayList<Day15Cell> cells = new ArrayList<>();
            for (int j = 0; j < numStrings.length; j++) {
                cells.add(new Day15Cell(i, j, Integer.parseInt(input[i].substring(j, j + 1))));
            }
            grid.add(cells);
        };

        for (int i = 0; i < grid.size(); i++) {
            for (int j = 0; j < grid.get(0).size(); j++) {
                grid.get(i).get(j).addNeighbors(grid);
            }
        }

        start = grid.get(0).get(0);
        end = grid.get(grid.size() - 1).get(grid.get(0).size() - 1);

        openSet.add(start);

        while (openSet.size() > 0) {
            int winner = 0;
            for (int i = 0; i < openSet.size(); i++) {
                if (openSet.get(i).f < openSet.get(winner).f) {
                    winner = i;
                }
            }

            current = openSet.get(winner);

            if (current == end) {
                long cost = calculatePathCost(current);
                System.out.println("DONE! Cost: " + (cost - start.cost));
                System.out.println("Execution time: " + (System.currentTimeMillis() - startTime) + "ms");
                return;
            }

            // add winner to closedSet
            closedSet.add(current);
            // remove winner from openSet
            openSet.remove(winner);

            // evaluate neighbors
            ArrayList<Day15Cell> neighbors = current.neighbors;
            for (int i = 0; i < neighbors.size(); i++) {
                Day15Cell neighbor = neighbors.get(i);
                if (!closedSet.contains(neighbor)) {
                    int tentativeG = neighbor.cost + current.g;
                    boolean newPath = false;
                    if (openSet.contains(neighbor)) {
                        if (tentativeG < neighbor.g) {
                            neighbor.g = tentativeG;
                            newPath = true;
                        }
                    } else {
                        neighbor.g = tentativeG;
                        openSet.add(neighbor);
                        newPath = true;
                    }

                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    if (newPath) {
                        neighbor.cameFrom = current;
                    }
                }
            }
        }

        System.out.println("No solution.");
    }

    public static float heuristic(Day15Cell a, Day15Cell b) {
        return (float) Math.sqrt((b.row - a.row) * (b.row - a.row) + (b.col - a.col) * (b.col - a.col));
    };

    public static long calculatePathCost(Day15Cell current) {
        long cost = 0L;
        Day15Cell p = current;
        cost += p.cost;
        while (p.cameFrom != null) {
            p = p.cameFrom;
            cost += p.cost;
        }
        return cost;
    };

    public static String[] expandInput(String[] input) {
        String[] expandedInput = new String[input.length * 5];
        String previousString;
        for (int i = 0; i < input.length; i++) {
            String row = input[i];
            StringBuilder sb = new StringBuilder(row);
            previousString = row;
            // four times
            for (int j = 0; j < 4; j++) {
                Stream<String> strStream = Arrays.stream(previousString.split(""));
                strStream = strStream.map(charStr -> Integer.toString(Integer.parseInt(charStr) < 9 ? Integer.parseInt(charStr) + 1 : 1));
                String[] strArr = strStream.toArray(String[]::new);
                String joined = String.join("", strArr);
                sb.append(joined);
                previousString = joined;
            }
            expandedInput[i] = sb.toString();
        }

        for (int i = input.length; i < expandedInput.length; i++) {
            String lineToIncrement = expandedInput[i - input.length];
            Stream<String> strStream = Arrays.stream(lineToIncrement.split(""));
            strStream = strStream.map(charStr -> Integer.toString(Integer.parseInt(charStr) < 9 ? Integer.parseInt(charStr) + 1 : 1));
            String[] strArr = strStream.toArray(String[]::new);
            String joined = String.join("", strArr);
            expandedInput[i] = joined;
        }

        return expandedInput;
    }
}
