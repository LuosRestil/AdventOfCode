import time
import multiprocessing as mp
from functools import lru_cache

start = time.time()

# Constants for better performance
DIR_UP = '^'
DIR_DOWN = 'v'
DIR_LEFT = '<'
DIR_RIGHT = '>'
WALL = '#'
OPEN = '.'

# Pre-computed lookup tables
next_pos_mods = {
    DIR_UP: (-1, 0),  # Using tuples is faster than lists
    DIR_DOWN: (1, 0),
    DIR_LEFT: (0, -1),
    DIR_RIGHT: (0, 1)
}

turns = {
    DIR_UP: DIR_RIGHT,
    DIR_DOWN: DIR_LEFT,
    DIR_LEFT: DIR_UP,
    DIR_RIGHT: DIR_DOWN
}

filename = '../inputs/day06.txt'

# Cache the grid parsing for reuse
_grid_cache = None

def get_grid():
    global _grid_cache
    if _grid_cache is None:
        with open(filename, 'r') as infile:
            _grid_cache = [list(line.strip()) for line in infile.readlines()]
    # Return a deep copy to avoid modifying the cached grid
    return [row[:] for row in _grid_cache]

# Fast inline grid boundary check
def is_in_grid(grid, pos):
    return 0 <= pos[0] < len(grid) and 0 <= pos[1] < len(grid[0])

# Optimized guard finder
def get_guard(grid):
    for i, row in enumerate(grid):
        try:
            # Using index is faster than iterating when we expect to find the item early
            j = row.index(DIR_UP)
            return {'pos': [i, j], 'dir': DIR_UP}
        except ValueError:
            continue
    return None

def move(grid, guard):
    next_pos_mod = next_pos_mods[guard['dir']]
    next_pos = [guard['pos'][0] + next_pos_mod[0], guard['pos'][1] + next_pos_mod[1]]
    
    if is_in_grid(grid, next_pos) and grid[next_pos[0]][next_pos[1]] == WALL:
        guard['dir'] = turns[guard['dir']]
    else:
        guard['pos'] = next_pos

def tick(grid, guard, path):
    move(grid, guard)
    path_key = tuple(guard['pos'])  # Tuples are hashable and faster than converting to strings
    
    # Fast path lookup and cycle detection
    if path_key in path and guard['dir'] in path[path_key]:
        return False
        
    if is_in_grid(grid, guard['pos']):
        if path_key not in path:
            path[path_key] = []
        path[path_key].append(guard['dir'])
    return True

def solve(grid):
    guard = get_guard(grid)
    if not guard:
        return None
        
    # Pre-allocate path dictionary with expected size
    path = {}
    path[tuple(guard['pos'])] = [DIR_UP]
    
    # Main solver loop
    while is_in_grid(grid, guard['pos']):
        if not tick(grid, guard, path):
            return None
    return path

def run_pt_1():
    grid = get_grid()
    return solve(grid)

# Worker function for multiprocessing
def process_coord(coord_data):
    pos, grid, guard_pos = coord_data
    
    # Skip guard starting position
    if pos[0] == guard_pos[0] and pos[1] == guard_pos[1]:
        return 0
        
    # Make a local copy of the grid
    local_grid = [row[:] for row in grid]
    
    # Modify the grid and check the solution
    local_grid[pos[0]][pos[1]] = WALL
    completed = solve(local_grid)
    
    return 0 if completed else 1

# Optimized part 2 with multiprocessing
def run_pt_2(trodden):
    grid = get_grid()
    guard = get_guard(grid)
    guard_pos = guard['pos']
    
    # Calculate number of processes to use (75% of CPU cores)
    num_cores = int(mp.cpu_count() * 0.75)
    if num_cores < 1:
        num_cores = 1
    
    # Prepare data for workers
    coords_data = [(pos, grid, guard_pos) for pos in trodden]
    
    # Use multiprocessing to process coordinates in parallel
    with mp.Pool(processes=num_cores) as pool:
        results = pool.map(process_coord, coords_data)
    
    # Sum the results
    count = sum(results)
    print(f'Part 2: {count}')
    return count

if __name__ == '__main__':
    # Part 1
    path = run_pt_1()
    trodden = list(path.keys())
    print(f"Part 1: {len(trodden)}")
    
    # Part 2
    run_pt_2(trodden)
    
    end = time.time()
    print(f'time: {end - start:.3f}s') 