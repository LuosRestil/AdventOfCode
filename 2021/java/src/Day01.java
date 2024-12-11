import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Day01 {
    public static void main(String[] args) throws FileNotFoundException {
        // Part 1
        Scanner s = new Scanner(new File("src/inputs/Day01.txt"));
        List<Integer> depthReadings = new ArrayList<Integer>();
        while (s.hasNextLine()){
            depthReadings.add(Integer.parseInt(s.nextLine()));
        }
        s.close();

        int increases = 0;
        for (int i = 1; i < depthReadings.size(); i++) {
            if (depthReadings.get(i) > depthReadings.get(i - 1)) {
                increases++;
            }
        }

        System.out.println("Answer1: " + increases);

        // Part 2
        increases = 0;
        int prevSum = depthReadings.subList(0, 3).stream().reduce(0, Integer::sum);

        for (int i = 1; i < depthReadings.size() - 2; i++) {
            int currSum = depthReadings.subList(i, i + 3).stream().reduce(0, Integer::sum);
            if (currSum > prevSum) {
                increases++;
            }
            prevSum = currSum;
        }

        System.out.println("Answer2: " + increases);
    }
}
