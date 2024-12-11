public class Day16ParseResult {
    private int index;
    private int versionTotal;
    private long value;

    public Day16ParseResult(int index, int versionTotal, long value) {
        this.index = index;
        this.versionTotal = versionTotal;
        this.value = value;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public int getVersionTotal() {
        return versionTotal;
    }

    public void setVersionTotal(int versionTotal) {
        this.versionTotal = versionTotal;
    }

    public long getValue() {
        return value;
    }

    public void setValue(long value) {
        this.value = value;
    }
}