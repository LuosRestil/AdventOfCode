// Optimized JavaScript implementation
'use strict';

// Performance measurement
console.time("time");

const fs = require("fs");
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// Constants for better performance and readability
const DIR_UP = "^";
const DIR_DOWN = "v";
const DIR_LEFT = "<";
const DIR_RIGHT = ">";
const WALL = "#";
const OPEN = ".";

// Pre-computed movement and turn maps (avoids lookups in hot loops)
const nextPosMods = {
  [DIR_UP]: [-1, 0],
  [DIR_DOWN]: [1, 0],
  [DIR_LEFT]: [0, -1],
  [DIR_RIGHT]: [0, 1],
};

const turns = {
  [DIR_UP]: DIR_RIGHT,
  [DIR_DOWN]: DIR_LEFT,
  [DIR_LEFT]: DIR_UP,
  [DIR_RIGHT]: DIR_DOWN,
};

const filepath = "../inputs/day06.txt";

// Worker thread code
if (!isMainThread) {
  const { grid: workerGrid, guardPos, trodden } = workerData;
  
  let localCount = 0;
  for (const posStr of trodden) {
    const pos = posStr.split(':').map(Number);
    
    // Skip guard starting position
    if (pos[0] === guardPos[0] && pos[1] === guardPos[1]) {
      continue;
    }
    
    // Clone grid for this iteration (more efficient than modifying and restoring)
    const grid = workerGrid.map(row => [...row]);
    
    // Modify grid and check solution
    grid[pos[0]][pos[1]] = WALL;
    const completed = solve(grid);
    if (!completed) {
      localCount++;
    }
  }
  
  // Send result back to main thread
  parentPort.postMessage(localCount);
}
// Main thread code
else {
  main().catch(console.error);
}

async function main() {
  // Part 1
  const path = runPt1();
  const keys = Object.keys(path);
  console.log(`Part 1: ${keys.length}`);
  
  // Part 2
  await runPt2(keys);
  
  console.timeEnd("time");
}

function runPt1() {
  const grid = getGrid();
  return solve(grid);
}

async function runPt2(trodden) {
  const grid = getGrid();
  const guard = getGuard(grid);
  
  // Calculate thread pool size (75% of available CPU cores)
  const numCPUs = require('os').cpus().length;
  const numWorkers = Math.max(1, Math.floor(numCPUs * 0.75));
  
  // Split work into chunks for workers
  const chunkSize = Math.ceil(trodden.length / numWorkers);
  const chunks = [];
  
  for (let i = 0; i < numWorkers; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, trodden.length);
    chunks.push(trodden.slice(start, end));
  }
  
  // Process chunks in parallel using worker threads
  const results = await Promise.all(chunks.map(chunk => 
    runWorker(grid, guard.pos, chunk)
  ));
  
  // Sum up results from all workers
  const count = results.reduce((sum, val) => sum + val, 0);
  console.log(`Part 2: ${count}`);
  return count;
}

function runWorker(grid, guardPos, trodden) {
  return new Promise((resolve) => {
    const worker = new Worker(__filename, {
      workerData: { 
        grid, 
        guardPos,
        trodden 
      }
    });
    
    worker.on('message', resolve);
    worker.on('error', (err) => {
      console.error(err);
      resolve(0);
    });
  });
}

function solve(grid) {
  const guard = getGuard(grid);
  
  // Using a hash map for path tracking
  const path = {};
  path[`${guard.pos[0]}:${guard.pos[1]}`] = [DIR_UP];
  
  // Faster iteration with direct boundary checks
  while (isInGrid(grid, guard.pos)) {
    if (!tick(grid, guard, path)) return null;
  }
  
  return path;
}

function tick(grid, guard, path) {
  move(grid, guard);
  
  // Faster key generation and lookup
  const pathKey = `${guard.pos[0]}:${guard.pos[1]}`;
  const directions = path[pathKey];
  
  // Check if cycle detected
  if (directions && directions.includes(guard.dir)) {
    return false;
  }
  
  if (isInGrid(grid, guard.pos)) {
    // Initialize array if needed (avoiding conditional assignment)
    if (!directions) {
      path[pathKey] = [];
    }
    
    path[pathKey]?.push(guard.dir);
  }
  
  return true;
}

function move(grid, guard) {
  const nextPosMod = nextPosMods[guard.dir];
  const nextPos = [guard.pos[0] + nextPosMod[0], guard.pos[1] + nextPosMod[1]];
  
  // Check if hitting wall
  if (isInGrid(grid, nextPos) && grid[nextPos[0]][nextPos[1]] === WALL) {
    guard.dir = turns[guard.dir];
  } else {
    guard.pos = nextPos;
  }
}

function getGuard(grid) {
  // Early return for optimization
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] === DIR_UP) {
        return { pos: [i, j], dir: DIR_UP };
      }
    }
  }
  return null;
}

// Inlined boundary check for performance
function isInGrid(grid, pos) {
  return (
    pos[0] >= 0 &&
    pos[0] < grid.length &&
    pos[1] >= 0 &&
    pos[1] < grid[0].length
  );
}

function getGrid() {
  // Read file once and parse efficiently
  const content = fs.readFileSync(filepath, { encoding: "utf-8" });
  
  // Split content into grid with minimal operations
  return content
    .trim()
    .split("\n")
    .map(line => line.split(""));
} 