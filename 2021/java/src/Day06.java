import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;
import java.util.stream.Collectors;

public class Day06 {
    public static void main(String[] args) throws FileNotFoundException {
        // Part 1
//        int days = 80;
        // Part 2
        int days = 256;

        Scanner scanner = new Scanner(new File("src/inputs/Day06.txt"));
        String fishString = scanner.nextLine();
        scanner.close();

        List<Integer> fishList = Arrays.stream(fishString.split(",")).map(Integer::parseInt).collect(Collectors.toList());

        Map<Integer, Long> fishMap = new HashMap<>();
        for (int i = 0; i <= 8; i++) {
            fishMap.put(i, 0L);
        }
        for (Integer fish : fishList) {
            fishMap.put(fish, fishMap.get(fish) + 1);
        }

        for (int i = 0; i < days; i++) {
            Map<Integer, Long> newFishMap = new HashMap<>();
            newFishMap.put(8, fishMap.get(0));
            newFishMap.put(7, fishMap.get(8));
            newFishMap.put(6, fishMap.get(7) + fishMap.get(0));
            newFishMap.put(5, fishMap.get(6));
            newFishMap.put(4, fishMap.get(5));
            newFishMap.put(3, fishMap.get(4));
            newFishMap.put(2, fishMap.get(3));
            newFishMap.put(1, fishMap.get(2));
            newFishMap.put(0, fishMap.get(1));
            fishMap = newFishMap;
        }
        System.out.println("Answer: " + fishMap.values().stream().reduce(0L, Long::sum));
    }

}
