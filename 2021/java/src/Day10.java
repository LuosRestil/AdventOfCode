import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

public class Day10 {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner scanner = new Scanner(new File("src/inputs/Day10.txt"));
        List<String> lines = new ArrayList<>();
        while (scanner.hasNextLine()) {
            lines.add(scanner.nextLine());
        }
        scanner.close();

        Map<Character, Character> charMap = new HashMap<>();
        charMap.put('(', ')');
        charMap.put('[', ']');
        charMap.put('{', '}');
        charMap.put('<', '>');

        Map<Character, Integer> errorScoreMap = new HashMap<>();
        errorScoreMap.put(')', 3);
        errorScoreMap.put(']', 57);
        errorScoreMap.put('}', 1197);
        errorScoreMap.put('>', 25137);

        Map<Character, Integer> completionScoreMap = new HashMap<>();
        completionScoreMap.put(')', 1);
        completionScoreMap.put(']', 2);
        completionScoreMap.put('}', 3);
        completionScoreMap.put('>', 4);

        List<Character> errorChars = new ArrayList<>();

        List<Long> rowTotals = new ArrayList<>();

        for (String line : lines) {
            Stack<Character> stack = new Stack<>();
            boolean invalid = false;
            for (int i = 0; i < line.length(); i++) {
                char curr = line.charAt(i);
                if (curr == '(' || curr == '[' || curr == '{' || curr == '<') {
                    stack.push(curr);
                } else {
                    if (!stack.isEmpty() && charMap.get(stack.peek()) == curr) {
                        stack.pop();
                    } else {
                        errorChars.add(curr);
                        invalid = true;
                        break;
                    }
                }
            }
            if (!invalid) {
                long rowTotal = 0;
                List<Character> completionChars = new ArrayList<>();
                while (!stack.isEmpty()) {
                    completionChars.add(charMap.get(stack.pop()));
                }
                for (Character character : completionChars) {
                    rowTotal *= 5;
                    rowTotal += completionScoreMap.get(character);
                }
                rowTotals.add(rowTotal);
            }
        }

        int errorTotal = errorChars.stream().map(errorScoreMap::get).mapToInt(Integer::intValue).sum();
        System.out.println("Answer1: " + errorTotal);

        rowTotals.sort(null);
        System.out.println("Answer2: " + rowTotals.get(rowTotals.size() / 2));
    }
}
