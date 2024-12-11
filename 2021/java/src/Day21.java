import java.util.*;

public class Day21 {
    public static void main(String[] args) {
        // Pt. 1
        int[] p1 = {8, 0}; // first is space, second is score
        int[] p2 = {9, 0};
        int dieVal = 1;
        int rolls = 0;
        int[][] players = {p1, p2};
        int activePlayer = 0;

        while (p1[1] < 1000 && p2[1] < 1000) {
            int[] player = players[activePlayer];
            for (byte i = 0; i < 3; i++) {
                rolls++;
                player[0] += dieVal;
                dieVal++;
                if (dieVal > 100) {
                    dieVal = 1;
                }
            }
            while (player[0] > 10) {
                player[0] -= 10;
            }
            player[1] += player[0];
            activePlayer = activePlayer == 0 ? 1 : 0;
        }
        System.out.println("Answer 1: " + players[activePlayer][1] * rolls);


        // Pt. 2
        long[] answer = playDirac(new int[][] {new int[] {0,8}, new int[] {0,9}}, 0,0);
        System.out.println("Answer 2: " + Math.max(answer[0], answer[1]));
    }

    // returns [p1wins, p2wins]
    public static long[] playDirac(int[][] playerData, int activePlayer, int level) {
        int[] player = playerData[activePlayer]; // [0] is score, [1] is pos
        int playerOriginalPos = player[1];
        int nextActivePlayer = activePlayer == 0 ? 1 : 0;
        long[] wins = {0L, 0L};

        // simulate possible rolls
        Map<Integer, Integer> finalPositionsMap = new HashMap<>();
        finalPositionsMap.put(playerOriginalPos + 3 > 10 ? playerOriginalPos + 3 - 10 : playerOriginalPos + 3, 1);
        finalPositionsMap.put(playerOriginalPos + 4 > 10 ? playerOriginalPos + 4 - 10 : playerOriginalPos + 4, 3);
        finalPositionsMap.put(playerOriginalPos + 5 > 10 ? playerOriginalPos + 5 - 10 : playerOriginalPos + 5, 6);
        finalPositionsMap.put(playerOriginalPos + 6 > 10 ? playerOriginalPos + 6 - 10 : playerOriginalPos + 6, 7);
        finalPositionsMap.put(playerOriginalPos + 7 > 10 ? playerOriginalPos + 7 - 10 : playerOriginalPos + 7, 6);
        finalPositionsMap.put(playerOriginalPos + 8 > 10 ? playerOriginalPos + 8 - 10 : playerOriginalPos + 8, 3);
        finalPositionsMap.put(playerOriginalPos + 9 > 10 ? playerOriginalPos + 9 - 10 : playerOriginalPos + 9, 1);
        List<Map.Entry<Integer, Integer>> finalPositionsList = finalPositionsMap.entrySet().stream().sorted((a, b) -> b.getKey() - a.getKey()).toList();

        for (Map.Entry<Integer, Integer> entry : finalPositionsList) {
            if (player[0] + entry.getKey() >= 21) {
                wins[activePlayer] += entry.getValue();
            } else {
                int[] p1 = {playerData[0][0], playerData[0][1]};
                int[] p2 = {playerData[1][0], playerData[1][1]};
                if (activePlayer == 0) {
                    p1[0] += entry.getKey();
                    p1[1] = entry.getKey();
                } else {
                    p2[0] += entry.getKey();
                    p2[1] = entry.getKey();
                }
                var played = playDirac(new int[][] {p1, p2}, nextActivePlayer, level + 1);
                wins[0] += played[0] * entry.getValue();
                wins[1] += played[1] * entry.getValue();
            }
        }

        return wins;
    }
}
