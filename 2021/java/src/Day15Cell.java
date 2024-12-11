import java.util.ArrayList;

public class Day15Cell {
    final int row;
    final int col;
    final int cost;
    int g;
    float f;
    float h;
    final ArrayList<Day15Cell> neighbors;
    Day15Cell cameFrom;

    Day15Cell(int row, int col, int cost) {
        this.row = row;
        this.col = col;
        this.cost = cost;
        this.neighbors = new ArrayList<>();
    }

    void addNeighbors(ArrayList<ArrayList<Day15Cell>> grid) {
        if (this.row < grid.size() - 1) {
            this.neighbors.add(grid.get(this.row + 1).get(this.col));
        }
        if (this.row > 0) {
            this.neighbors.add(grid.get(this.row - 1).get(this.col));
        }
        if (this.col < grid.get(0).size() - 1) {
            this.neighbors.add(grid.get(this.row).get(this.col + 1));
        }
        if (this.col > 0) {
            this.neighbors.add(grid.get(this.row).get(this.col - 1));
        }
    }
}
