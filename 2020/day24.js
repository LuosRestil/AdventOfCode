import { getInput } from '../utils.js';

let input = getInput('day24.txt').split('\n');

let tiles = {};
for (let line of input) {
  let x = 0;
  let y = 0;
  let z = 0;

  let i = 0;
  while (i < line.length) {
    let instruction = line[i];
    i++;
    if (instruction === "n" || instruction === "s") {
      instruction += line[i];
      i++;
    }
    switch (instruction) {
      case "nw":
        y += 1;
        z -= 1;
        break;
      case "ne":
        x += 1;
        z -= 1;
        break;
      case "e":
        x += 1;
        y -= 1;
        break;
      case "se":
        z += 1;
        y -= 1;
        break;
      case "sw":
        z += 1;
        x -= 1;
        break;
      case "w":
        x -= 1;
        y += 1;
        break;
      default:
        console.log("EVERYTHING IS BROKEN");
    }
  }

  if (tiles[`f${x}_${y}_${z}`]) {
    if (tiles[`f${x}_${y}_${z}`].color === "white") {
      tiles[`f${x}_${y}_${z}`].color = "black";
    } else {
      tiles[`f${x}_${y}_${z}`].color = "white";
    }
  } else {
    tiles[`f${x}_${y}_${z}`] = { color: "black", x, y, z, flip: false };
  }
}

let total = 0;
for (let val of Object.values(tiles)) {
  if (val.color === "black") {
    total += 1;
  }
}

console.log(`Answer: ${total}`);

// **********************************************************************************

function getAdjacent(tileData) {
  // console.log(
  //   `checking adjacent of ${tileData.x}, ${tileData.y}, ${tileData.z}, color: ${tileData.color}`
  // );
  let x = tileData.x;
  let y = tileData.y;
  let z = tileData.z;
  let black = 0;
  let white = 0;
  // z - 1, y + 1
  if (tiles[`f${x}_${y + 1}_${z - 1}`]) {
    if (tiles[`f${x}_${y + 1}_${z - 1}`].color === "black") {
      // console.log("black adjacent found");
      black++;
    } else {
      white++;
    }
  }
  // x + 1, z - 1
  if (tiles[`f${x + 1}_${y}_${z - 1}`]) {
    if (tiles[`f${x + 1}_${y}_${z - 1}`].color === "black") {
      // console.log("black adjacent found");
      black++;
    } else {
      white++;
    }
  }
  // x + 1, y - 1
  if (tiles[`f${x + 1}_${y - 1}_${z}`]) {
    if (tiles[`f${x + 1}_${y - 1}_${z}`].color === "black") {
      // console.log("black adjacent found");
      black++;
    } else {
      white++;
    }
  }
  // z + 1, y - 1
  if (tiles[`f${x}_${y - 1}_${z + 1}`]) {
    if (tiles[`f${x}_${y - 1}_${z + 1}`].color === "black") {
      // console.log("black adjacent found");
      black++;
    } else {
      white++;
    }
  }
  // x - 1, z + 1
  if (tiles[`f${x - 1}_${y}_${z + 1}`]) {
    if (tiles[`f${x - 1}_${y}_${z + 1}`].color === "black") {
      // console.log("black adjacent found");
      black++;
    } else {
      white++;
    }
  }
  // x - 1, y + 1
  if (tiles[`f${x - 1}_${y + 1}_${z}`]) {
    if (tiles[`f${x - 1}_${y + 1}_${z}`].color === "black") {
      // console.log("black adjacent found");
      black++;
    } else {
      white++;
    }
  }
  return { black, white };
}

function surroundBlacks(tileData) {
  let x = tileData.x;
  let y = tileData.y;
  let z = tileData.z;
  // z - 1, y + 1
  if (!tiles[`f${x}_${y + 1}_${z - 1}`]) {
    tiles[`f${x}_${y + 1}_${z - 1}`] = {
      color: "white",
      flip: false,
      x,
      y: y + 1,
      z: z - 1,
    };
  }
  // x + 1, z - 1
  if (!tiles[`f${x + 1}_${y}_${z - 1}`]) {
    tiles[`f${x + 1}_${y}_${z - 1}`] = {
      color: "white",
      flip: false,
      x: x + 1,
      y,
      z: z - 1,
    };
  }
  // x + 1, y - 1
  if (!tiles[`f${x + 1}_${y - 1}_${z}`]) {
    tiles[`f${x + 1}_${y - 1}_${z}`] = {
      color: "white",
      flip: false,
      x: x + 1,
      y: y - 1,
      z,
    };
  }
  // z + 1, y - 1
  if (!tiles[`f${x}_${y - 1}_${z + 1}`]) {
    tiles[`f${x}_${y - 1}_${z + 1}`] = {
      color: "white",
      flip: false,
      x,
      y: y - 1,
      z: z + 1,
    };
  }
  // x - 1, z + 1
  if (!tiles[`f${x - 1}_${y}_${z + 1}`]) {
    tiles[`f${x - 1}_${y}_${z + 1}`] = {
      color: "white",
      flip: false,
      x: x - 1,
      y,
      z: z + 1,
    };
  }
  // x - 1, y + 1
  if (!tiles[`f${x - 1}_${y + 1}_${z}`]) {
    tiles[`f${x - 1}_${y + 1}_${z}`] = {
      color: "white",
      flip: false,
      x: x - 1,
      y: y + 1,
      z,
    };
  }
}

function flipTiles() {
  for (let tile in tiles) {
    let tileData = tiles[tile];
    let adjacent = getAdjacent(tileData);
    // console.log(`adjacent black: ${adjacent.black}`);
    if (
      tileData.color === "black" &&
      (adjacent.black === 0 || adjacent.black > 2)
    ) {
      tiles[tile].flip = true;
      // console.log(`will flip`);
    } else if (tileData.color === "white" && adjacent.black === 2) {
      tiles[tile].flip = true;
      // console.log(`will flip`);
    }
  }
  for (let tile in tiles) {
    if (tiles[tile].flip === true) {
      if (tiles[tile].color === "white") {
        tiles[tile].color = "black";
      } else {
        tiles[tile].color = "white";
      }
    }
    tiles[tile].flip = false;
  }
}

for (let val of Object.values(tiles)) {
  if (val.color === "black") {
    surroundBlacks(val);
  }
}

const numberOfDays = 100;

for (let i = 0; i < numberOfDays; i++) {
  for (let val of Object.values(tiles)) {
    if (val.color === "black") {
      surroundBlacks(val);
    }
  }
  flipTiles();
}

total = 0;
for (let val of Object.values(tiles)) {
  if (val.color === "black") {
    total += 1;
  }
}

console.log(`Answer: ${total}`);
