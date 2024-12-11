#include <stdio.h>
#include <stdlib.h>

int comparator(const void *a, const void *b) {
    return *(int *)a - *(int *)b;
}

int main() {
    FILE *fp = fopen("inputs/day01.txt", "r");
    if (fp == NULL) {
        perror("Error opening file.");
        return 1;
    }
    char line[15];
    int linect = 0;
    while (fgets(line, sizeof(line), fp) != NULL) {
        linect++;
    }
    fclose(fp);

    int left[linect];
    int right[linect];
    int i = 0;
    fp = fopen("inputs/day01.txt", "r");
    if (fp == NULL) {
        perror("Error opening file.");
        return 1;
    }
    while (fgets(line, sizeof(line), fp) != NULL) {
        sscanf(line, "%d %d", &left[i], &right[i]);
        i++;
    }
    fclose(fp);

    qsort(left, linect, sizeof(int), comparator);
    qsort(right, linect, sizeof(int), comparator);

    long diff = 0;
    for (int i = 0; i < linect; i++) {
        diff += abs(left[i] - right[i]);
    }
    printf("Part 1: %d\n", diff);

    long sim_score = 0;
    for (int i = 0; i < linect; i++) {
        int curr = left[i];
        int ct = 0;
        for (int j = 0; j < linect; j++) {
            if (right[j] == curr) {
                ct++;
            }
        }
        sim_score += curr * ct;
    }
    printf("Part 2: %d\n", sim_score);

    return 0;
}
