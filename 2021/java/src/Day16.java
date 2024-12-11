import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

public class Day16 {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner scanner = new Scanner(new File("src/inputs/Day16.txt"));
        String input = scanner.nextLine();
        scanner.close();

        String bin = hexToBin(input);
        Day16ParseResult res = parse(bin, 0);
        System.out.println("Version total: " + res.getVersionTotal());
        System.out.println("Value: " + res.getValue());
    }

    public static Day16ParseResult parse(String bin, int i) {
        int versionTotal = 0;
        long value = 0;

        int version = Integer.parseInt(bin.substring(i, i + 3), 2);
        versionTotal += version;
        i += 3;

        int typeId = Integer.parseInt(bin.substring(i, i + 3), 2);
        i += 3;

        // literal
        if (typeId == 4) {
            StringBuilder valStr = new StringBuilder();
            while (bin.charAt(i) == '1') {
                i++;
                valStr.append(bin, i, i + 4);
                i += 4;
            }
            i++;
            valStr.append(bin, i, i + 4);
            i += 4;
            value = Long.parseLong(valStr.toString(), 2);

        // operator
        } else {
            List<Long> packetValues = new ArrayList<>();
            char lengthTypeId = bin.charAt(i);
            i++;

            // next 15 bits indicate number of bits in subpackets
            if (lengthTypeId == '0') {
                int subPacketBits = Integer.parseInt(bin.substring(i, i + 15), 2);
                i += 15;
                int limit = i + subPacketBits;
                while (i < limit) {
                    Day16ParseResult packetResult = parse(bin, i);
                    packetValues.add(packetResult.getValue());
                    i = packetResult.getIndex();
                    versionTotal += packetResult.getVersionTotal();
                }

            // next 11 bits indicate number of subpackets
            } else {
                int numSubPackets = Integer.parseInt(bin.substring(i, i + 11), 2);
                i += 11;
                for (int subPacketI = 0; subPacketI < numSubPackets; subPacketI++) {
                    Day16ParseResult packetResult = parse(bin, i);
                    packetValues.add(packetResult.getValue());
                    i = packetResult.getIndex();
                    versionTotal += packetResult.getVersionTotal();
                }
            }

            // determine packet value based on typeId
            switch (typeId) {
                // sum
                case 0:
                    value = packetValues.stream().reduce(0L, Long::sum);
                    break;

                // product
                case 1:
                    value = packetValues.stream().reduce(1L, (a, b) -> a * b);
                    break;

                // minimum
                case 2:
                    value = Collections.min(packetValues);
                    break;

                // maximum
                case 3:
                    value = Collections.max(packetValues);
                    break;

                // greater than
                case 5:
                    value = packetValues.get(0) > packetValues.get(1) ? 1 : 0;
                    break;

                // less than
                case 6:
                    value = packetValues.get(0) < packetValues.get(1) ? 1 : 0;
                    break;

                case 7:
                    value = Objects.equals(packetValues.get(0), packetValues.get(1)) ? 1 : 0;
                    break;
            }
        }
        return new Day16ParseResult(i, versionTotal, value);
    }

    public static String hexToBin(String hex) {
        StringBuilder bin = new StringBuilder();
        for (int i = hex.length() - 1; i >= 0; i--) {
            StringBuilder binDigits = new StringBuilder(Integer.toBinaryString(Integer.parseInt(String.valueOf(hex.charAt(i)), 16)));
            while (binDigits.length() < 4) {
                binDigits.insert(0, '0');
            }
            bin.insert(0, binDigits);
        }
        return bin.toString();
    }
}
