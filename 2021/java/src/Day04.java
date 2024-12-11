import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class Day04 {
    public static void main(String[] args) throws FileNotFoundException {
        // Part 1
        Scanner scanner = new Scanner(new File("src/inputs/Day04.txt"));
        List<String> data = new ArrayList<>();
        while (scanner.hasNextLine()){
            data.add(scanner.nextLine());
        }
        scanner.close();

        String[] balls = data.get(0).split(",");
        List<List<List<String>>> cards = new ArrayList<>();
        List<List<String>> currentCard = new ArrayList<>();

        for (String line : data.subList(2, data.size())) {
            if (line.length() == 0) {
                cards.add(currentCard);
                currentCard = new ArrayList<>();
            } else {
                currentCard.add(Arrays.asList(line.trim().split("\\s+")));
            }
        }

        for (String ball : balls) {
            for (List<List<String>> card : cards) {
                for (List<String> row : card) {
                    for (int i = 0; i < row.size(); i++) {
                        if (row.get(i).equals(ball)) {
                            row.set(i, "*" + row.get(i));

                            // Part 1
//                            if (cardIsWinner(card)) {
//                                int totalUnmarked = getTotalUnmarked(card);
//                                System.out.println("Answer1: " + totalUnmarked * Integer.parseInt(ball));
//                                return;
//                            }

                            // Part 2
                            if (cards.stream().allMatch(Day04::cardIsWinner)) {
                                int totalUnmarked = getTotalUnmarked(card);
                                System.out.println("Answer2: " + totalUnmarked * Integer.parseInt(ball));
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    public static boolean cardIsWinner(List<List<String>> card) {
        for (List<String> row : card) {
            if (row.stream().allMatch(str -> str.startsWith("*"))) {
                return true;
            }
        }
        for (int i = 0; i < card.size(); i++) {
            int finalI = i;
            if (card.stream().allMatch(row -> row.get(finalI).startsWith("*"))) {
                return true;
            }
        }
        return false;
    }

    public static int getTotalUnmarked(List<List<String>> card) {
        int total = 0;
        for (List<String> row : card) {
            for (String num : row) {
                if (!num.startsWith("*")) {
                    total += Integer.parseInt(num);
                }
            }
        }
        return total;
    }
}
