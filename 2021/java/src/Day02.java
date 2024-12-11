import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Day02 {
    public static void main(String[] args) throws FileNotFoundException {
        // Part 1
        Scanner s = new Scanner(new File("src/inputs/Day02.txt"));
        List<String[]> instructions = new ArrayList<String[]>();
        while (s.hasNextLine()){
            instructions.add(s.nextLine().split(" "));
        }
        s.close();

        int horizontalPosition = 0;
        int depth = 0;

        for (String[] instruction : instructions) {
            String dir = instruction[0];
            int amt = Integer.parseInt(instruction[1]);
            if (dir.equals("forward")) {
                horizontalPosition += amt;
            }
            if (dir.equals("down")) {
                depth += amt;
            }
            if (dir.equals("up")) {
                depth -= amt;
            }
        }

        System.out.println("Answer1: " + (horizontalPosition * depth));

        // Part 2
        horizontalPosition = 0;
        depth = 0;
        int aim = 0;

        for (String[] instruction : instructions) {
            String dir = instruction[0];
            int amt = Integer.parseInt(instruction[1]);
            if (dir.equals("forward")) {
                horizontalPosition += amt;
                depth += aim * amt;
            }
            if (dir.equals("down")) {
                aim += amt;
            }
            if (dir.equals("up")) {
                aim -= amt;
            }
        }

        System.out.println("Answer2: " + (horizontalPosition * depth));
    }
}
