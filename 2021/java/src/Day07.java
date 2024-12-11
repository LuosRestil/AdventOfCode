import java.io.File;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.Scanner;

public class Day07 {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner scanner = new Scanner(new File("src/inputs/Day07.txt"));
        String posString = scanner.nextLine();
        scanner.close();

        int[] posArr = Arrays.stream(posString.split(",")).map(Integer::parseInt).mapToInt(i -> i).sorted().toArray();
        int median = posArr[posArr.length / 2];
        int mean = Arrays.stream(posArr).sum() / posArr.length;

        // Pt. 1
        int totalCost = 0;
        for (int num : posArr) {
            totalCost += Math.abs(num - median);
        }
        System.out.println("Answer 1: " + totalCost);

        // Pt. 2
        totalCost = 0;
        for (int num : posArr) {
            int moves = Math.abs(num - mean);
            totalCost += moves * (moves + 1) / 2;
        }
        System.out.println("Answer 2: " + totalCost);
    }
}
