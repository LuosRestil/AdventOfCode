#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <array>
#include <unordered_map>
#include <unordered_set>
#include <chrono>
#include <cstdlib>
#include <thread>

const std::string FILEPATH = "inputs/day06.txt";
const std::unordered_map<char, std::array<int, 2>> NEXT_POS_MODS = {
    {'^', {-1, 0}},
    {'v', {1, 0}},
    {'<', {0, -1}},
    {'>', {0, 1}}};
const std::unordered_map<char, char> TURNS = {
    {'^', '>'},
    {'v', '<'},
    {'<', '^'},
    {'>', 'v'}};

using Grid = std::vector<std::vector<char>>;

Grid make_grid(const std::string &filepath);
void print_grid(const Grid &grid);
Grid run_pt_1();
bool solve(Grid &grid);
std::array<int, 2> get_guard_pos(const Grid &grid);
bool is_in_grid(const Grid &grid, const std::array<int, 2> &pos);
bool tick(Grid &grid, std::array<int, 2> &pos, std::unordered_map<std::string, std::unordered_set<char>> &path);
void move(Grid &grid, std::array<int, 2> &pos, char dir);
int count_trodden(const Grid &grid);
void run_pt_2(const std::vector<std::array<int,2>> &trodden);

int main()
{
    auto start = std::chrono::high_resolution_clock::now();

    auto grid = run_pt_1();
    std::cout << "Part 1: " << count_trodden(grid) << std::endl;

    std::vector<std::array<int, 2>> trodden;
    for (int i = 0; i < grid.size(); i++)
    {
        for (int j = 0; j < grid.at(0).size(); j++)
        {
            trodden.emplace_back(std::array<int, 2>{i, j});
        }
    }
    run_pt_2(trodden);

    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
    std::cout << "Execution time: " << duration.count() << " ms" << std::endl;
}

Grid make_grid(const std::string &filepath)
{
    Grid grid;

    std::ifstream file(filepath);
    if (!file.is_open())
    {
        std::cerr << "Error: Could not open file.";
    }

    std::string line;
    while (std::getline(file, line))
    {
        grid.emplace_back(line.begin(), line.end());
    }

    file.close();

    return grid;
}

void print_grid(const Grid &grid)
{
    for (const auto &row : grid)
    {
        for (const auto &ch : row)
        {
            std::cout << ch;
        }
        std::cout << std::endl;
    }
}

Grid run_pt_1()
{
    auto grid = make_grid(FILEPATH);
    solve(grid);
    return grid;
}

void run_pt_2(const std::vector<std::array<int,2>> &trodden) {
    auto grid = make_grid(FILEPATH);
    auto guard_pos = get_guard_pos(grid);
    int count = 0;
    for (const auto &pos : trodden) {
        if (pos.at(0) == guard_pos.at(0) && pos.at(1) == guard_pos.at(1))
            continue;
        auto copy = grid;
        copy.at(pos.at(0)).at(pos.at(1)) = '#';
        bool completed = solve(copy);
        if (!completed)
            count++;
    }
    std::cout << "Part 2: " << count << std::endl;
}

bool solve(Grid &grid)
{
    std::array<int, 2> guard_pos = get_guard_pos(grid);
    std::unordered_map<std::string, std::unordered_set<char>> path;
    while (is_in_grid(grid, guard_pos))
    {
        if (!tick(grid, guard_pos, path))
        {
            return false;
        }
    }
    return true;
}

std::array<int, 2> get_guard_pos(const Grid &grid)
{
    for (int i = 0; i < grid.size(); i++)
    {
        for (int j = 0; j < grid.at(0).size(); j++)
        {
            if (grid.at(i).at(j) == '^')
                return {i, j};
        }
    }
    return {-1, -1};
}

bool is_in_grid(const Grid &grid, const std::array<int, 2> &pos)
{
    return pos.at(0) >= 0 &&
           pos.at(0) < grid.size() &&
           pos.at(1) >= 0 &&
           pos.at(1) < grid.at(0).size();
}

bool tick(Grid &grid, std::array<int, 2> &pos, std::unordered_map<std::string, std::unordered_set<char>> &path)
{
    char dir = grid.at(pos.at(0)).at(pos.at(1));
    move(grid, pos, dir);

    // std::system("clear");
    // print_grid(grid);
    // std::this_thread::sleep_for(std::chrono::milliseconds(500));

    auto path_key = std::to_string(pos.at(0)) + ":" + std::to_string(pos.at(1));
    auto path_entry = path.find(path_key);
    if (path_entry != path.end())
    {
        // std::cout << "been here:" << path_key << std::endl;
        std::unordered_set<char> &chars = path_entry->second;
        // for (auto ch : chars) {
        //     std::cout << ch << " ";
        // }
        // std::cout << std::endl;
        // std::this_thread::sleep_for(std::chrono::milliseconds(2000));
        if (chars.find(grid.at(pos.at(0)).at(pos.at(1))) != chars.end())
        {
            // std::cout << "and from this direction" << std::endl;
            return false;
        }
    }
    if (is_in_grid(grid, pos))
    {
        if (path_entry == path.end())
        {
            path.emplace(path_key, std::unordered_set<char>{});
        }
        path[path_key].insert(grid.at(pos.at(0)).at(pos.at(1)));
    }
    return true;
}

void move(Grid &grid, std::array<int, 2> &pos, char dir)
{
    auto next_pos_mod = NEXT_POS_MODS.at(dir);
    std::array<int, 2> next_pos = {pos.at(0) + next_pos_mod.at(0), pos.at(1) + next_pos_mod.at(1)};
    bool has_turned = false;
    if (is_in_grid(grid, next_pos))
    {
        if (grid.at(next_pos.at(0)).at(next_pos.at(1)) == '#')
        {
            grid.at(pos.at(0)).at(pos.at(1)) = TURNS.at(dir);
            has_turned = true;
        }
        else
        {
            grid.at(next_pos.at(0)).at(next_pos.at(1)) = dir;
        }
    }

    if (!has_turned)
    {
        pos.at(0) = next_pos.at(0);
        pos.at(1) = next_pos.at(1);
    }
}

int count_trodden(const Grid &grid)
{
    int count = 0;
    for (const auto &row : grid)
    {
        for (const auto &col : row)
        {
            if (TURNS.find(col) != TURNS.end())
            {
                count++;
            }
        }
    }
    return count;
}
