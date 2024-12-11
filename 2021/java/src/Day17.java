public class Day17 {
    public static void main(String[] args) {
        // input
        // target area: x=60..94, y=-171..-136

        int minX = 60;
        int maxX = 94;
        int minY = -171;
        int maxY = -136;

        int target = minX;
        int minXVelocity = 0;
        int xVal = 0;
        while (xVal < target) {
            minXVelocity++;
            xVal += minXVelocity;
        }

        int maxYVelocity = Math.abs(minY) - 1;
        int maxYAchieved = maxYVelocity * (maxYVelocity + 1) / 2;
        System.out.println("Answer1: " + maxYAchieved);

        // *******************************************************

        int total = 0;
        for (int i = minXVelocity; i <= maxX; i++) {
            int j = maxYVelocity;
            while (j >= minY) {
                // do steps
                int x = 0;
                int y = 0;
                int velX = i;
                int velY = j;
                boolean hit = false;
                while (y > minY && !hit) {
                    x += velX;
                    y += velY;
                    velX = Math.max(velX - 1, 0);
                    velY--;
                    if (x <= maxX && x >= minX && y <= maxY && y >= minY) {
                        hit = true;
                        total++;
                    }
                }
                j--;
            }
        }
        System.out.println("Answer2: " + total);
    }
}
