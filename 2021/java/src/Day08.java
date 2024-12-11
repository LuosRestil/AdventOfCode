import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

public class Day08 {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner scanner = new Scanner(new File("src/inputs/Day08.txt"));
        List<String> data = new ArrayList<>();
        while (scanner.hasNextLine()) {
            data.add(scanner.nextLine());
        }
        scanner.close();

        // Pt. 1
        int totalEasy = 0;
        for (String line : data) {
            String[] output = line.split(" \\| ")[1].split(" ");
            for (String digit : output) {
                if (digit.length() == 2 || digit.length() == 3 || digit.length() == 4 || digit.length() == 7) {
                    totalEasy++;
                }
            }
        }
        System.out.println("Answer1: " + totalEasy);

        // Pt. 2
        int totalOutput = 0;
        for (String line : data) {
            String[] sides = line.split(" \\| ");
            String[] left = sides[0].split(" ");
            String[] right = sides[1].split(" ");

            Map<Integer, String> numsMap = new HashMap<>();

            numsMap.put(1, Arrays.stream(left).filter(word -> word.length() == 2).findAny().orElseThrow());
            numsMap.put(7, Arrays.stream(left).filter(word -> word.length() == 3).findAny().orElseThrow());
            numsMap.put(4, Arrays.stream(left).filter(word -> word.length() == 4).findAny().orElseThrow());
            numsMap.put(8, Arrays.stream(left).filter(word -> word.length() == 7).findAny().orElseThrow());
            numsMap.put(3, Arrays.stream(left).filter(word -> word.length() == 5 && Arrays.stream(numsMap.get(1).split("")).allMatch(word::contains)).findAny().orElseThrow());

            String[] fivers = Arrays.stream(left).filter(word -> word.length() == 5).toArray(String[]::new);
            String[] sixers = Arrays.stream(left).filter(word -> word.length() == 5).toArray(String[]::new);

            String[] fiverCommonChars = Arrays.stream(fivers[0].split("")).filter(character -> Arrays.stream(fivers).allMatch(word -> word.contains(character))).toArray(String[]::new);
            String[] diffsBetweenFourAndOne = Arrays.stream(numsMap.get(4).split("")).filter(character -> !numsMap.get(1).contains(character)).toArray(String[]::new);

            String topLine = Arrays.stream(numsMap.get(7).split("")).filter(character -> !numsMap.get(1).contains(character)).findAny().orElseThrow();
            String middleLine = Arrays.asList(fiverCommonChars).contains(diffsBetweenFourAndOne[0]) ? diffsBetweenFourAndOne[0] : diffsBetweenFourAndOne[1];
            String bottomLine = Arrays.stream(fiverCommonChars).filter(character -> !character.equals(topLine) && !character.equals(middleLine)).findAny().orElseThrow();

            String[] zero = Arrays.stream(numsMap.get(8).split("")).filter(character -> !character.equals(middleLine)).toArray(String[]::new);
            numsMap.put(0, Arrays.stream(left).filter(word -> word.length() == 6 && Arrays.stream(word.split("")).allMatch(character -> Arrays.asList(zero).contains(character))).findAny().orElseThrow());
            numsMap.put(9, Arrays.stream(left).filter(word -> word.length() == 6 && !Arrays.stream(word.split("")).allMatch(character -> Arrays.asList(numsMap.get(0).split("")).contains(character)) && Arrays.stream(numsMap.get(1).split("")).allMatch(character -> Arrays.asList(word.split("")).contains(character))).findAny().orElseThrow());
            numsMap.put(6, Arrays.stream(left).filter(word -> word.length() == 6 && !Arrays.stream(word.split("")).allMatch(character -> Arrays.asList(numsMap.get(0).split("")).contains(character)) && !Arrays.stream(word.split("")).allMatch(character -> Arrays.asList(numsMap.get(9).split("")).contains(character))).findAny().orElseThrow());
            numsMap.put(5, Arrays.stream(left).filter(word -> word.length() == 5 && Arrays.stream(word.split("")).allMatch(character -> Arrays.asList(numsMap.get(6).split("")).contains(character))).findAny().orElseThrow());
            numsMap.put(2, Arrays.stream(left).filter(word -> word.length() == 5 && !Arrays.stream(word.split("")).allMatch(character -> Arrays.asList(numsMap.get(3).split("")).contains(character)) && !Arrays.stream(word.split("")).allMatch(character -> Arrays.asList(numsMap.get(5).split("")).contains(character))).findAny().orElseThrow());

            StringBuilder lineOutput = new StringBuilder();
            for (String word : right) {
                switch (word.length()) {
                    case 2:
                        lineOutput.append("1");
                        break;
                    case 3:
                        lineOutput.append("7");
                        break;
                    case 4:
                        lineOutput.append("4");
                        break;
                    case 5:
                        if (Arrays.stream(word.split("")).allMatch(character -> Arrays.asList(numsMap.get(2).split("")).contains(character))) {
                            lineOutput.append("2");
                        } else if (Arrays.stream(word.split("")).allMatch(character -> Arrays.asList(numsMap.get(3).split("")).contains(character))) {
                            lineOutput.append("3");
                        } else {
                            lineOutput.append("5");
                        }
                        break;
                    case 6:
                        if (Arrays.stream(word.split("")).allMatch(character -> Arrays.asList(numsMap.get(6).split("")).contains(character))) {
                            lineOutput.append("6");
                        } else if (Arrays.stream(word.split("")).allMatch(character -> Arrays.asList(numsMap.get(9).split("")).contains(character))) {
                            lineOutput.append("9");
                        } else {
                            lineOutput.append("0");
                        }
                        break;
                    case 7:
                        lineOutput.append("8");
                        break;
                    default:
                        break;
                }
            }
//            System.out.println(lineOutput.toString());
//            System.out.println(numsMap.toString());
            totalOutput += Integer.parseInt(lineOutput.toString());
        }
        System.out.println("Answer2: " + totalOutput);
    }
}
