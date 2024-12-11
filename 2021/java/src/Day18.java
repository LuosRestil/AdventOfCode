import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.Stack;

public class Day18 {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner scanner = new Scanner(new File("src/inputs/Day18.txt"));
        List<String> snailfishNums = new ArrayList<>();
        while (scanner.hasNextLine()) {
            snailfishNums.add(scanner.nextLine());
        }
        scanner.close();

        String sum = snailfishNums.stream().reduce((acc, curr) -> reduceSnailfishNum(addSnailfishNums(acc, curr))).get();
        System.out.println("Answer1: " + getMagnitude(sum));

        int maxMag = 0;
        for (int i = 0; i < snailfishNums.size(); i++) {
            for (int j = 0; j < snailfishNums.size(); j++) {
                if (i != j) {
                    int mag = getMagnitude(reduceSnailfishNum(addSnailfishNums(snailfishNums.get(i), snailfishNums.get(j))));
                    if (mag > maxMag) {
                        maxMag = mag;
                    }
                }
            }
        }
        System.out.println("Answer2: " + maxMag);
    }

    public static String addSnailfishNums(String sn1, String sn2) {
        return String.format("[%s,%s]", sn1, sn2);
    }

    public static String reduceSnailfishNum(String sn) {
        boolean complete = false;
        while (!complete) {
            int depth = 0;
            boolean hasExploded = false;
            Stack<Integer> bracketStack = new Stack<>();
            for (int i = 0; i < sn.length(); i++) {
                if (sn.charAt(i) == '[') {
                    depth++;
                    bracketStack.push(i);
                } else if (sn.charAt(i) == ']') {
                    // explode
                    if (depth > 4) {
                        hasExploded = true;
                        int explodingNumStartIndex = bracketStack.pop();
                        int explodingNumEndIndex = i;
                        // exploding num should be a pair of digits
                        String[] explodingNumPair = splitSnailfishNumber(sn.substring(explodingNumStartIndex, explodingNumEndIndex + 1));
                        // replace pair with 0
                        sn = sn.substring(0, explodingNumStartIndex) + "0" + sn.substring(explodingNumEndIndex + 1);
                        // add to right
                        for (int j = explodingNumStartIndex + 1; j < sn.length(); j++) {
                            if (Character.isDigit(sn.charAt(j))) {
                                int numStartIndex = j;
                                int numEndIndex = j;
                                // found num, find end
                                while (Character.isDigit(sn.charAt(numEndIndex + 1))) {
                                    numEndIndex++;
                                }
                                int num = Integer.parseInt(sn.substring(numStartIndex, numEndIndex + 1));
                                sn = sn.substring(0, numStartIndex) + (num + Integer.parseInt(explodingNumPair[1])) + sn.substring(numEndIndex + 1);
                                break;
                            }
                        }
                        // add to left
                        for (int j = explodingNumStartIndex - 1; j >= 0; j--) {
                            if (Character.isDigit(sn.charAt(j))) {
                                int numStartIndex = j;
                                int numEndIndex = j;
                                // found num, find start
                                while (Character.isDigit(sn.charAt(numStartIndex - 1))) {
                                    numStartIndex--;
                                }
                                int num = Integer.parseInt(sn.substring(numStartIndex, numEndIndex + 1));
                                sn = sn.substring(0, numStartIndex) + (num + Integer.parseInt(explodingNumPair[0])) + sn.substring(numEndIndex + 1);
                                break;
                            }
                        }
                        break;
                    }
                    depth--;
                }
            }

            boolean hasSplit = false;
            if (!hasExploded) {
                // check for splits
                for (int i = 0; i < sn.length(); i++) {
                    if (Character.isDigit(sn.charAt(i))) {
                        int numStartIndex = i;
                        int numEndIndex = i;
                        while (Character.isDigit(sn.charAt(numEndIndex + 1))) {
                            numEndIndex++;
                        }
                        if (numEndIndex > numStartIndex) {
                            hasSplit = true;
                            int num = Integer.parseInt(sn.substring(numStartIndex, numEndIndex + 1));
                            float divided = (float) num / 2;
                            sn = String.format("%s[%d,%d]%s", sn.substring(0, numStartIndex), (int) Math.floor(divided), (int) Math.ceil(divided), sn.substring(numEndIndex + 1));
                            break;
                        }
                    }
                }
            }

            if (!hasExploded && !hasSplit) {
                complete = true;
            }
        }

        return sn;
    }

    public static int getMagnitude(String sn) {
        String[] splitNum = splitSnailfishNumber(sn);
        int left;
        int right;
        try {
            left = Integer.parseInt(splitNum[0]);
        } catch (NumberFormatException e) {
            left = getMagnitude(splitNum[0]);
        }
        try {
            right = Integer.parseInt(splitNum[1]);
        } catch (NumberFormatException e) {
            right = getMagnitude(splitNum[1]);
        }
        return (3 * left) + (2 * right);
    }

    public static String[] splitSnailfishNumber(String sn) {
        Stack<Character> bracketStack = new Stack<>();
        for (int i = 1; i < sn.length() - 1; i++) {
            char c = sn.charAt(i);
            if (c == ',' && bracketStack.empty()) {
                return new String[] {sn.substring(1,i), sn.substring(i + 1, sn.length() - 1)};
            } else if (c == '[') {
                bracketStack.push(c);
            } else if (c == ']') {
                bracketStack.pop();
            }
        }
        throw new RuntimeException("Invalid snailfish number");
    }
}
