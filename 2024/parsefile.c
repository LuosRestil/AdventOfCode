#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char** get_grid(const char* filepath, int *gridlen, int *rowlen);

int main() {
    char* filepath = "inputs/day06sample.txt";
    int gridlen = 0;
    int rowlen = 0;
    char** grid = get_grid(filepath, &gridlen, &rowlen);
    if (grid == NULL) {
        fprintf(stderr, "Failed to load grid from file: %s\n", filepath);
        return EXIT_FAILURE;
    }

    for (int i = 0; i < gridlen; i++) {
        for (int j = 0; j < rowlen; j++) {
            printf("%c", grid[i][j]);
        }
        printf("\n");
    }
}

char** get_grid(const char* filepath, int *gridlen, int *rowlen) {
    FILE *file = fopen(filepath, "r");
    char line[1024];
    int linecount = 0;
    int linelen = 0;

    if (!file) {
        perror("Failed to open file.");
        return NULL;
    }

    // first pass, determine num lines and line len
    while (fgets(line, sizeof(line), file)) {
        linelen = strlen(line) + 1; // only the last non-newline-terminated line will count, include null terminator
        linecount++;
    }

    // allocate grid memory
    char** grid = malloc(linecount * sizeof(char *));
    if (!grid) {
        fclose(file);
        return NULL;
    }
    for (int i = 0; i < linecount; i++) {
        grid[i] = malloc((linelen + 1) * sizeof(char));
        if (!grid[i]) {
            // clean up already allocated memory if allocation fails
            for (int j = 0; j < i; j++) {
                free(grid[j]);
            }
            free(grid);
            fclose(file);
            return NULL;
        }
    }

    // rewind and read the file again to store the lines
    rewind(file);
    int idx = 0;
    while (fgets(grid[idx], linelen + 1, file)) {
        if (grid[idx][strlen(grid[idx]) - 1] == '\n') {
            grid[idx][strlen(grid[idx]) - 1] = '\0'; // remove newline
        }
        idx++;
    }

    fclose(file);
    *gridlen = linecount;
    *rowlen = linelen;

    return grid;
}