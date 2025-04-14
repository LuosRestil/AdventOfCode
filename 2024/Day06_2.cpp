// This version implemented by Cursor based on Day06.java
#include <iostream>
#include <fstream>
#include <vector>
#include <unordered_map>
#include <chrono>
#include <string>
#include <bitset>
#include <thread>
#include <mutex>
#include <memory>

// Cache-friendly compact structures with minimal memory footprint
struct Coord {
    int16_t row, col;
    
    Coord(int16_t r, int16_t c) : row(r), col(c) {}
    
    bool operator==(const Coord& other) const {
        return row == other.row && col == other.col;
    }
};

// Custom hash function for Coord - optimized bit manipulation
namespace std {
    template <>
    struct hash<Coord> {
        size_t operator()(const Coord& c) const {
            // Faster than shifting when coordinate range is limited
            return (c.row * 10000) + c.col;
        }
    };
}

// Efficient guard structure
struct Guard {
    int16_t row, col;
    char dir;
    
    Guard(int16_t r, int16_t c, char d) : row(r), col(c), dir(d) {}
};

const std::string filepath = "inputs/day06.txt";

// Direction constants and lookup tables - aligned for cache efficiency
static constexpr int8_t DIR_UP = 0, DIR_DOWN = 1, DIR_LEFT = 2, DIR_RIGHT = 3;
static constexpr int8_t dirRow[4] = {-1, 1, 0, 0};   // ^ v < >
static constexpr int8_t dirCol[4] = {0, 0, -1, 1};   // ^ v < >
static constexpr char dirChars[4] = {'^', 'v', '<', '>'};
static constexpr char turnMap[4] = {'>', '<', '^', 'v'}; // ^ v < >

// We use strings instead of vector<char> for grid - much more efficient for this case
using Grid = std::vector<std::string>;
using PathMap = std::unordered_map<Coord, std::bitset<4>>;

// Pre-computed fast lookup for direction index
static int8_t fastDirIndex[256];

// Initialize lookup tables
__attribute__((constructor))
static void initTables() {
    // Set all to -1 by default
    for (int i = 0; i < 256; i++) {
        fastDirIndex[i] = -1;
    }
    
    // Set the direction values
    fastDirIndex[static_cast<unsigned char>('^')] = DIR_UP;
    fastDirIndex[static_cast<unsigned char>('v')] = DIR_DOWN;
    fastDirIndex[static_cast<unsigned char>('<')] = DIR_LEFT;
    fastDirIndex[static_cast<unsigned char>('>')] = DIR_RIGHT;
}

// Super-fast inline direction lookup
inline int8_t getDirIndex(char dir) {
    return fastDirIndex[static_cast<unsigned char>(dir)];
}

inline char getTurn(char dir) {
    return turnMap[getDirIndex(dir)];
}

// Load grid once and reuse - with memory pre-allocation
Grid getGrid() {
    Grid grid;
    std::ifstream file(filepath);
    
    if (!file.is_open()) {
        std::cerr << "Error opening file: " << filepath << std::endl;
        return grid;
    }
    
    grid.reserve(200); // Pre-allocate (adjusted based on expected size)
    std::string line;
    // Count file lines first to optimize allocation
    while (std::getline(file, line)) {
        grid.push_back(std::move(line));
    }
    
    return grid;
}

// Fast guard position finder - optimized with early return
Guard findGuard(const Grid& grid) {
    for (int16_t i = 0; i < grid.size(); i++) {
        const std::string& row = grid[i];
        for (int16_t j = 0; j < row.length(); j++) {
            if (row[j] == '^') {
                return Guard(i, j, '^');
            }
        }
    }
    return Guard(0, 0, '^');
}

// Fast boundary check
inline bool isInGrid(const Grid& grid, int16_t row, int16_t col) {
    return row >= 0 && row < grid.size() && col >= 0 && col < grid[row].length();
}

void moveGuard(const Grid& grid, Guard& guard) {
    int8_t dirIdx = getDirIndex(guard.dir);
    int16_t nextRow = guard.row + dirRow[dirIdx];
    int16_t nextCol = guard.col + dirCol[dirIdx];
    
    if (isInGrid(grid, nextRow, nextCol) && grid[nextRow][nextCol] == '#') {
        guard.dir = turnMap[dirIdx];
    } else {
        guard.row = nextRow;
        guard.col = nextCol;
    }
}

// Optimized path update - faster hash map lookups
bool updatePath(PathMap& path, const Guard& guard) {
    Coord pos(guard.row, guard.col);
    int8_t dirBit = getDirIndex(guard.dir);
    
    auto it = path.find(pos);
    if (it != path.end()) {
        // If we've been here in this direction before, cycle detected
        if (it->second.test(dirBit)) {
            return false;
        }
        it->second.set(dirBit);
    } else {
        std::bitset<4> dirs;
        dirs.set(dirBit);
        path.emplace(pos, dirs);
    }
    
    return true;
}

// Optimized solver
PathMap solve(const Grid& grid) {
    Guard guard = findGuard(grid);
    PathMap path;
    path.reserve(5000); // Pre-allocate hash map size
    
    // Initialize starting position with UP direction
    path[Coord(guard.row, guard.col)].set(DIR_UP);
    
    // Specialized fast path for movement
    while (true) {
        moveGuard(grid, guard);
        
        if (!isInGrid(grid, guard.row, guard.col)) {
            break;
        }
        
        if (!updatePath(path, guard)) {
            return PathMap();
        }
    }
    
    return path;
}

PathMap runPt1(const Grid& grid) {
    return solve(grid);
}

// Multi-threaded part 2 solution
int runPt2(const Grid& originalGrid, const PathMap& pt1Path) {
    int count = 0;
    Guard startGuard = findGuard(originalGrid);
    
    // Extract coordinates from part 1 result
    std::vector<Coord> trodden;
    trodden.reserve(pt1Path.size());
    for (const auto& entry : pt1Path) {
        trodden.push_back(entry.first);
    }
    
    // Calculate number of worker threads (use 75% of available cores)
    unsigned int numThreads = std::thread::hardware_concurrency() * 3 / 4;
    if (numThreads == 0) numThreads = 4; // Fallback
    
    // Thread-safe counter
    std::mutex countMutex;
    
    // Distribute work among threads
    std::vector<std::thread> threads;
    threads.reserve(numThreads);
    
    // Process chunk of coordinates per thread
    const int chunkSize = (trodden.size() + numThreads - 1) / numThreads;
    
    for (unsigned int t = 0; t < numThreads; t++) {
        threads.emplace_back([&, t]() {
            int localCount = 0;
            
            // Calculate range for this thread
            size_t start = t * chunkSize;
            size_t end = std::min(start + chunkSize, trodden.size());
            
            Grid localGrid = originalGrid; // Each thread gets its own grid copy
            
            for (size_t i = start; i < end; i++) {
                const auto& coord = trodden[i];
                
                // Skip guard starting position
                if (coord.row == startGuard.row && coord.col == startGuard.col) {
                    continue;
                }
                
                // Make a change to the grid without copying the whole thing
                char original = localGrid[coord.row][coord.col];
                localGrid[coord.row][coord.col] = '#';
                
                if (solve(localGrid).empty()) {
                    localCount++;
                }
                
                // Restore grid to original state for next iteration
                localGrid[coord.row][coord.col] = original;
            }
            
            // Accumulate local count to global count
            std::lock_guard<std::mutex> lock(countMutex);
            count += localCount;
        });
    }
    
    // Wait for all threads to complete
    for (auto& thread : threads) {
        thread.join();
    }
    
    return count;
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();
    
    // Load grid once
    Grid originalGrid = getGrid();
    
    // Part 1
    auto path = runPt1(originalGrid);
    std::cout << "Part 1: " << path.size() << std::endl;
    
    // Part 2
    int part2 = runPt2(originalGrid, path);
    std::cout << "Part 2: " << part2 << std::endl;
    
    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count();
    
    std::cout << "Time: " << duration << "ms" << std::endl;
    
    return 0;
} 