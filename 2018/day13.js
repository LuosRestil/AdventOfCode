import fs from "fs";
import path from "node:path";

const grid = fs
  .readFileSync(
    path.join(import.meta.dirname, "inputs", "day13.txt"),
    "utf-8",
  )
  .split("\n")
  .map((row) => row.split(""));
let carts = [];
let cartTypes = new Set(["^", ">", "v", "<"]);
let turns = [turnLeft, (dir) => dir, turnRight];
let cartDirs = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
};
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    if (cartTypes.has(grid[row][col])) {
      let dir = cartDirs[grid[row][col]];
      carts.push({
        x: col,
        y: row,
        dir: { x: dir.x, y: dir.y },
        nextTurn: 0,
        destroyed: false,
      });
      if (grid[row][col - 1] === "-") {
        grid[row][col] = "-";
      } else {
        grid[row][col] = "|";
      }
    }
  }
}

let firstCollisionLoc = null;
let lastCartLoc = null;
while (true) {
  sortCarts();
  tick();
  if (!firstCollisionLoc) {
    let destroyed = carts.filter((cart) => cart.destroyed);
    if (destroyed.length) {
      firstCollisionLoc = { x: destroyed[0].x, y: destroyed[0].y };
    }
  }
  let notDestroyed = carts.filter((cart) => !cart.destroyed);
  if (notDestroyed.length === 1) {
    lastCartLoc = { x: notDestroyed[0].x, y: notDestroyed[0].y };
    break;
  }
}

console.log(`Part 1: ${firstCollisionLoc.x},${firstCollisionLoc.y}`);
console.log(`Part 2: ${lastCartLoc.x},${lastCartLoc.y}`);

function tick() {
  for (let cart of carts) {
    if (cart.destroyed) continue;
    // move
    cart.x += cart.dir.x;
    cart.y += cart.dir.y;

    // turn
    let char = grid[cart.y][cart.x];
    switch (char) {
      case "+":
        turns[cart.nextTurn](cart.dir);
        cart.nextTurn = (cart.nextTurn + 1) % 3;
        break;
      case "\\":
        if (cart.dir.y) turnLeft(cart.dir);
        else if (cart.dir.x) turnRight(cart.dir);
        break;
      case "/":
        if (cart.dir.x) turnLeft(cart.dir);
        else if (cart.dir.y) turnRight(cart.dir);
        break;
      default:
        break;
    }
    // check collisions
    for (let other of carts) {
      if (cart === other || other.destroyed) continue;
      if (cart.x === other.x && cart.y === other.y) {
        cart.destroyed = true;
        other.destroyed = true;
      }
    }
  }
}

function turnLeft(dir) {
  if (dir.x === 0) {
    dir.x = dir.y;
    dir.y = 0;
  } else {
    dir.y = -dir.x;
    dir.x = 0;
  }
}

function turnRight(dir) {
  if (dir.x === 0) {
    dir.x = -dir.y;
    dir.y = 0;
  } else {
    dir.y = dir.x;
    dir.x = 0;
  }
}

function sortCarts() {
  carts.sort((a, b) => {
    if (a.y === b.y) {
      return a.x - b.x;
    }
    return a.y - b.y;
  });
}
