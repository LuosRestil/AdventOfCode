import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Day20 {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner scanner = new Scanner(new File("src/inputs/Day20.txt"));
        List<String> lines = new ArrayList<>();
        while (scanner.hasNextLine()) {
            lines.add(scanner.nextLine());
        }
        scanner.close();

        String algo = lines.get(0);
        List<String> image = lines.subList(2, lines.size());

        // Pt. 1
//        int iterations = 2;
        // Pt. 2
        int iterations = 50;

        char padVal = '.';

        for (int i = 0; i < iterations; i++) {
            image = process(image, algo, padVal);
            padVal = padVal == '.' ? '#' : '.';
        }

        int totalLit = 0;
        for (String row : image) {
            for (char c : row.toCharArray()) {
                if (c == '#') {
                    totalLit++;
                }
            }
        }
        System.out.println("Answer: " + totalLit);
    }

    public static List<String> process(List<String> image, String algo, char padVal) {
        expandImage(image, 3, padVal);
        List<StringBuilder> outputImage = new ArrayList<>();
        for (int i = 1; i < image.size() - 1; i++) {
            outputImage.add(new StringBuilder());
            for (int j = 1; j < image.get(0).length() - 1; j++) {
                StringBuilder binStrBldr = new StringBuilder();
                for (int k = -1; k <= 1; k++) {
                    image.get(i + k).substring(j - 1, j + 2).chars().forEach(c -> {
                        binStrBldr.append(c == '#' ? '1' : '0');
                    });
                }
                int binVal = Integer.parseInt(binStrBldr.toString(), 2);
                outputImage.get(i - 1).append(algo.charAt(binVal));
            }
        }
        return outputImage.stream().map(StringBuilder::toString).collect(Collectors.toList());
    }

    public static void expandImage(List<String> image, int expansionFactor, char padVal) {
        int rowLen = image.get(0).length();
        // add rows above and below
        for (int i = 0; i < expansionFactor; i++) {
            image.add(0, String.valueOf(padVal).repeat(rowLen));
            image.add(String.valueOf(padVal).repeat(rowLen));
        }
        // widen image
        String padding = String.valueOf(padVal).repeat(expansionFactor);
        image.replaceAll(row -> padding + row + padding);
    }
}
