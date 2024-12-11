import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

public class Day14 {
    public static void main(String[] args) throws FileNotFoundException {
        long start = System.currentTimeMillis();
        Scanner scanner = new Scanner(new File("src/inputs/Day14.txt"));
        List<String> input = new ArrayList<>();
        while (scanner.hasNextLine()) {
            input.add(scanner.nextLine());
        }
        scanner.close();

        // Pt. 1, iterations = 10
        // Pt. 2, iterations = 40
        int iterations = 40;

        String template = input.get(0);
        List<String> rawPairs = input.subList(2, input.size());

        Map<String, String> pairsMap = new HashMap<>();

        for (String pair : rawPairs) {
            String[] splitPair = pair.split(" -> ");
            pairsMap.put(splitPair[0], splitPair[1]);
        }

        Map<String, Long> freqMap = new HashMap<>();
        Map<String, Long> freqBin = new HashMap<>();

        for (int i = 0; i < template.length() - 1; i++) {
            String sub = template.substring(i, i + 2);
            if (freqMap.containsKey(sub)) {
                freqMap.put(sub, freqMap.get(sub) + 1);
            } else {
                freqMap.put(sub, 1L);
            }
        }

        for (int i = 0; i < iterations - 1; i++) {
            for (Map.Entry<String, Long> entry : freqMap.entrySet()) {
                String oldPair = entry.getKey();
                String child = pairsMap.get(oldPair);
                String newPair1 = oldPair.charAt(0) + child;
                String newPair2 = child + oldPair.charAt(1);
                if (freqBin.containsKey(newPair1)) {
                    freqBin.put(newPair1, freqBin.get(newPair1) + freqMap.get(oldPair));
                } else {
                    freqBin.put(newPair1, freqMap.get(oldPair));
                }
                if (freqBin.containsKey(newPair2)) {
                    freqBin.put(newPair2, freqBin.get(newPair2) + freqMap.get(oldPair));
                } else {
                    freqBin.put(newPair2, freqMap.get(oldPair));
                }
            }
            freqMap = new HashMap<>(freqBin);
            freqBin = new HashMap<>();
        }

        for (Map.Entry<String, Long> entry : freqMap.entrySet()) {
            String oldPair = entry.getKey();
            String child = pairsMap.get(oldPair);
            String char1 = oldPair.substring(0, 1);
            if (freqBin.containsKey(child)) {
                freqBin.put(child, freqBin.get(child) + freqMap.get(oldPair));
            } else {
                freqBin.put(child, freqMap.get(oldPair));
            }
            if (freqBin.containsKey(char1)) {
                freqBin.put(char1, freqBin.get(char1) + freqMap.get(oldPair));
            } else {
                freqBin.put(char1, freqMap.get(oldPair));
            }
        }
        String lastChar = template.substring(template.length() - 1);
        freqBin.put(lastChar, freqBin.get(lastChar) + 1);

        long min = Long.MAX_VALUE;
        long max = Long.MIN_VALUE;
        for (long value : freqBin.values()) {
            if (value < min) {
                min = value;
            }
            if (value > max) {
                max = value;
            }
        }
        System.out.println("Answer: " + (max - min));

        long end = System.currentTimeMillis();
        System.out.println("Execution time: " + (end - start));
    }
}
