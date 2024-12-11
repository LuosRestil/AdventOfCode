import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;
import java.util.stream.Collectors;

public class Day03 {
    public static void main(String[] args) throws FileNotFoundException {
        // Part 1
        Scanner scanner = new Scanner(new File("src/inputs/Day03.txt"));
        List<String> report = new ArrayList<String>();
        while (scanner.hasNextLine()){
            report.add(scanner.nextLine());
        }
        scanner.close();

        Map<Integer, Map<String, Integer>> freqMap = new HashMap<>();
        for (int i = 0; i < report.get(0).length(); i++) {
            Map<String, Integer> startVal = new HashMap<>();
            startVal.put("0", 0);
            startVal.put("1", 0);
            freqMap.put(i, startVal);
        }

        for (String line : report) {
            for (int i = 0; i < line.length(); i++) {
                freqMap.get(i).put(Character.toString(line.charAt(i)), freqMap.get(i).get(Character.toString(line.charAt(i))) + 1);
            }
        }

        StringBuilder sbGamma = new StringBuilder();
        StringBuilder sbEpsilon = new StringBuilder();
        for (int i = 0; i < report.get(0).length(); i++) {
            sbGamma.append(freqMap.get(i).get("0") > freqMap.get(i).get("1") ? "0" : "1");
            sbEpsilon.append(freqMap.get(i).get("0") > freqMap.get(i).get("1") ? "1" : "0");
        }
        int gammaDecimal = Integer.parseInt(sbGamma.toString(), 2);
        int epsilonDecimal = Integer.parseInt(sbEpsilon.toString(), 2);

        System.out.println("Answer1: " + (gammaDecimal * epsilonDecimal));

        // Part 2
        int i = 0;
        List<String> reportCopy = new ArrayList<>(report);
        while (reportCopy.size() > 1) {
            int zeros = 0;
            int ones = 0;
            for (String line : reportCopy) {
                if (Character.toString(line.charAt(i)).equals("0")) {
                    zeros++;
                } else {
                    ones++;
                }
            }
            String max = zeros > ones ? "0" : "1";
            int finalI = i;
            reportCopy = reportCopy.stream().filter(s -> Character.toString(s.charAt(finalI)).equals(max)).collect(Collectors.toList());
            i++;
        }
        String oxygenGenerator = reportCopy.get(0);

        i = 0;
        reportCopy = new ArrayList<>(report);
        while (reportCopy.size() > 1) {
            int zeros = 0;
            int ones = 0;
            for (String line : reportCopy) {
                if (Character.toString(line.charAt(i)).equals("0")) {
                    zeros++;
                } else {
                    ones++;
                }
            }
            String min = ones < zeros ? "1" : "0";
            int finalI1 = i;
            reportCopy = reportCopy.stream().filter(s -> Character.toString(s.charAt(finalI1)).equals(min)).collect(Collectors.toList());
            i++;
        }
        String co2Scrubber = reportCopy.get(0);

        System.out.println("Answer2: " + (Integer.parseInt(oxygenGenerator, 2) * Integer.parseInt(co2Scrubber, 2)));
    }
}
