import { getInput } from '../utils.js';

let input = getInput('day20.txt').split('\n');

let tiles = [];
let tile = [];
for (let line of input) {
  if (line === "") {
    tiles.push(tile);
    tile = [];
  } else {
    tile.push(line);
  }
}
tiles.push(tile);

tiles = tiles.map((tile) => {
  let id = tile[0].split(" ")[1];
  id = id.slice(0, id.length - 1);
  let content = tile.slice(1);
  let tb = content[0];
  let bb = content[content.length - 1];
  let lb = "";
  let rb = "";
  for (let row of content) {
    lb += row[0];
    rb += row[row.length - 1];
  }
  return {
    id,
    content,
    tb,
    bb,
    lb,
    rb,
  };
});

let bordermap = new Map();
for (let tile of tiles) {
  let tbr = tile.tb.split("").reverse().join("");
  let bbr = tile.bb.split("").reverse().join("");
  let lbr = tile.lb.split("").reverse().join("");
  let rbr = tile.rb.split("").reverse().join("");

  if (bordermap.has(tile.tb)) {
    bordermap.set(tile.tb, bordermap.get(tile.tb).concat([tile]));
  } else if (bordermap.has(tbr)) {
    bordermap.set(tbr, bordermap.get(tbr).concat([tile]));
  } else {
    bordermap.set(tile.tb, [tile]);
  }

  if (bordermap.has(tile.bb)) {
    bordermap.set(tile.bb, bordermap.get(tile.bb).concat([tile]));
  } else if (bordermap.has(bbr)) {
    bordermap.set(bbr, bordermap.get(bbr).concat([tile]));
  } else {
    bordermap.set(tile.bb, [tile]);
  }

  if (bordermap.has(tile.lb)) {
    bordermap.set(tile.lb, bordermap.get(tile.lb).concat([tile]));
  } else if (bordermap.has(lbr)) {
    bordermap.set(lbr, bordermap.get(lbr).concat([tile]));
  } else {
    bordermap.set(tile.lb, [tile]);
  }

  if (bordermap.has(tile.rb)) {
    bordermap.set(tile.rb, bordermap.get(tile.rb).concat([tile]));
  } else if (bordermap.has(rbr)) {
    bordermap.set(rbr, bordermap.get(rbr).concat([tile]));
  } else {
    bordermap.set(tile.rb, [tile]);
  }
}

let corners = [];

for (let tile of tiles) {
  let sharedSides = 0;

  let tbr = tile.tb.split("").reverse().join("");
  let bbr = tile.bb.split("").reverse().join("");
  let lbr = tile.lb.split("").reverse().join("");
  let rbr = tile.rb.split("").reverse().join("");

  if (bordermap.has(tile.tb) && bordermap.get(tile.tb).length > 1) {
    sharedSides++;
  }
  if (bordermap.has(tbr) && bordermap.get(tbr).length > 1) {
    sharedSides++;
  }
  if (bordermap.has(tile.bb) && bordermap.get(tile.bb).length > 1) {
    sharedSides++;
  }
  if (bordermap.has(bbr) && bordermap.get(bbr).length > 1) {
    sharedSides++;
  }
  if (bordermap.has(tile.lb) && bordermap.get(tile.lb).length > 1) {
    sharedSides++;
  }
  if (bordermap.has(lbr) && bordermap.get(lbr).length > 1) {
    sharedSides++;
  }
  if (bordermap.has(tile.rb) && bordermap.get(tile.rb).length > 1) {
    sharedSides++;
  }
  if (bordermap.has(rbr) && bordermap.get(rbr).length > 1) {
    sharedSides++;
  }
  if (sharedSides === 2) {
    corners.push(tile);
  }
}

let idProduct = 1;
for (let corner of corners) {
  idProduct *= corner.id;
}

console.log(`Answer: ${idProduct}`);

// ************************************************************************************

function rotateTile(tile) {
  let newTile = [];
  for (let i = 0; i < tile[0].length; i++) {
    let newRow = "";
    for (let j = tile.length - 1; j >= 0; j--) {
      newRow += tile[j][i];
    }
    newTile.push(newRow);
  }
  return newTile;
}

function flipTileHorizontal(tile) {
  let tileCopy = [...tile];
  for (let i = 0; i < tileCopy.length; i++) {
    tileCopy[i] = tileCopy[i].split("").reverse().join("");
  }
  return tileCopy;
}

function flipTileVertical(tile) {
  let tileCopy = [...tile];
  tileCopy.reverse();
  return tileCopy;
}

function reassignTileBorders(tile) {
  let tb = tile.content[0];
  let bb = tile.content[tile.content.length - 1];
  let lb = "";
  let rb = "";
  for (let row of tile.content) {
    lb += row[0];
    rb += row[row.length - 1];
  }
  tile.tb = tb;
  tile.bb = bb;
  tile.lb = lb;
  tile.rb = rb;
}

// create empty image
let arrangedTiles = [];
for (let i = 0; i < Math.sqrt(tiles.length); i++) {
  let row = [];
  for (let j = 0; j < Math.sqrt(tiles.length); j++) {
    row.push(0);
  }
  arrangedTiles.push(row);
}

let startingCorner = corners[0];

while (
  (bordermap.get(startingCorner.tb) &&
    bordermap.get(startingCorner.tb).length > 1) ||
  (bordermap.get(startingCorner.lb) &&
    bordermap.get(startingCorner.lb).length > 1) ||
  (bordermap.get(startingCorner.tb.split("").reverse("").join("")) &&
    bordermap.get(startingCorner.tb.split("").reverse("").join("")).length >
      1) ||
  (bordermap.get(startingCorner.lb.split("").reverse("").join("")) &&
    bordermap.get(startingCorner.lb.split("").reverse("").join("")).length > 1)
) {
  console.log("rotating top left corner");
  startingCorner.content = rotateTile(startingCorner.content);
  reassignTileBorders(startingCorner);
}

arrangedTiles[0][0] = startingCorner;

for (let i = 0; i < arrangedTiles.length; i++) {
  for (let j = 0; j < arrangedTiles[0].length; j++) {
    if (i === 0 && j === 0) {
      continue;
    }
    // current tile is arrangedTiles[i][j];
    if (j === 0) {
      // attach tile by matching top border
      let tileAbove = arrangedTiles[i - 1][j];
      let targetBorder = tileAbove.bb;
      let tilesWithTargetBorder;
      if (bordermap.has(targetBorder)) {
        tilesWithTargetBorder = bordermap.get(targetBorder);
      } else {
        tilesWithTargetBorder = bordermap.get(
          targetBorder.split("").reverse("").join("")
        );
      }
      let tileToAttach;
      for (let tile of tilesWithTargetBorder) {
        if (tile !== tileAbove) {
          tileToAttach = tile;
        }
      }
      for (let i = 0; i < 4; i++) {
        if (tileToAttach.tb !== tileAbove.bb) {
          tileToAttach.content = rotateTile(tileToAttach.content);
          reassignTileBorders(tileToAttach);
        }
      }
      if (tileToAttach.tb !== tileAbove.bb) {
        tileToAttach.content = flipTileHorizontal(tileToAttach.content);
        reassignTileBorders(tileToAttach);
      }
      for (let i = 0; i < 4; i++) {
        if (tileToAttach.tb !== tileAbove.bb) {
          tileToAttach.content = rotateTile(tileToAttach.content);
          reassignTileBorders(tileToAttach);
        }
      }
      if (tileToAttach.tb !== tileAbove.bb) {
        tileToAttach.content = flipTileHorizontal(tileToAttach.content);
        tileToAttach.content = flipTileVertical(tileToAttach.content);
        reassignTileBorders(tileToAttach);
      }
      for (let i = 0; i < 4; i++) {
        if (tileToAttach.tb !== tileAbove.bb) {
          tileToAttach.content = rotateTile(tileToAttach.content);
          reassignTileBorders(tileToAttach);
        }
      }
      if (tileToAttach.tb !== tileAbove.bb) {
        console.log("ORIENTATION ALROGITHM DOES NOT WORK!!!");
      }
      arrangedTiles[i][j] = tileToAttach;
    } else {
      // attach tile by matching left border
      let tileToLeft = arrangedTiles[i][j - 1];
      let targetBorder = tileToLeft.rb;
      let tilesWithTargetBorder;
      if (bordermap.has(targetBorder)) {
        tilesWithTargetBorder = bordermap.get(targetBorder);
      } else {
        tilesWithTargetBorder = bordermap.get(
          targetBorder.split("").reverse("").join("")
        );
      }
      let tileToAttach;
      for (let tile of tilesWithTargetBorder) {
        if (tile !== tileToLeft) {
          tileToAttach = tile;
        }
      }
      for (let i = 0; i < 4; i++) {
        if (tileToAttach.lb !== tileToLeft.rb) {
          tileToAttach.content = rotateTile(tileToAttach.content);
          reassignTileBorders(tileToAttach);
        }
      }
      if (tileToAttach.lb !== tileToLeft.rb) {
        tileToAttach.content = flipTileHorizontal(tileToAttach.content);
        reassignTileBorders(tileToAttach);
      }
      for (let i = 0; i < 4; i++) {
        if (tileToAttach.lb !== tileToLeft.rb) {
          tileToAttach.content = rotateTile(tileToAttach.content);
          reassignTileBorders(tileToAttach);
        }
      }
      if (tileToAttach.lb !== tileToLeft.rb) {
        tileToAttach.content = flipTileHorizontal(tileToAttach.content);
        tileToAttach.content = flipTileVertical(tileToAttach.content);
        reassignTileBorders(tileToAttach);
      }
      for (let i = 0; i < 4; i++) {
        if (tileToAttach.lb !== tileToLeft.rb) {
          tileToAttach.content = rotateTile(tileToAttach.content);
          reassignTileBorders(tileToAttach);
        }
      }
      if (tileToAttach.lb !== tileToLeft.rb) {
        console.log("ORIENTATION ALROGITHM DOES NOT WORK!!!");
      }
      arrangedTiles[i][j] = tileToAttach;
    }
  }
}

let image = [];

let arrangedTilesLength = arrangedTiles.length;
let arrangedTilesRowLength = arrangedTiles[0].length;
let tileContentLength = arrangedTiles[0][0].content.length;
for (let row = 0; row < arrangedTiles.length; row++) {
  for (let tileRow = 1; tileRow < tileContentLength - 1; tileRow++) {
    let imageRow = "";
    for (let tile = 0; tile < arrangedTiles[0].length; tile++) {
      imageRow += arrangedTiles[row][tile].content[tileRow].slice(
        1,
        arrangedTiles[row][tile].content[tileRow].length - 1
      );
    }
    image.push(imageRow);
  }
}

// console.log(image);

// refactor
function findSeaMonsters(image) {
  let monsterFound = false;
  for (let i = 0; i < image.length - 3; i++) {
    for (let j = 0; j < image[0].length - 20; j++) {
      if (
        (image[i][j + 18] === "#" || image[i][j + 18] === "0") &&
        (image[i + 1][j] === "#" || image[i + 1][j] === "0") &&
        (image[i + 1][j + 5] === "#" || image[i + 1][j + 5] === "0") &&
        (image[i + 1][j + 6] === "#" || image[i + 1][j + 6] === "0") &&
        (image[i + 1][j + 11] === "#" || image[i + 1][j + 11] === "0") &&
        (image[i + 1][j + 12] === "#" || image[i + 1][j + 12] === "0") &&
        (image[i + 1][j + 17] === "#" || image[i + 1][j + 17] === "0") &&
        (image[i + 1][j + 18] === "#" || image[i + 1][j + 18] === "0") &&
        (image[i + 1][j + 19] === "#" || image[i + 1][j + 19] === "0") &&
        (image[i + 2][j + 1] === "#" || image[i + 2][j + 1] === "0") &&
        (image[i + 2][j + 4] === "#" || image[i + 2][j + 4] === "0") &&
        (image[i + 2][j + 7] === "#" || image[i + 2][j + 7] === "0") &&
        (image[i + 2][j + 10] === "#" || image[i + 2][j + 10] === "0") &&
        (image[i + 2][j + 13] === "#" || image[i + 2][j + 13] === "0") &&
        (image[i + 2][j + 16] === "#" || image[i + 2][j + 16] === "0")
      ) {
        image[i][j + 18] = "0";
        image[i + 1][j] = "0";
        image[i + 1][j + 5] = "0";
        image[i + 1][j + 6] = "0";
        image[i + 1][j + 11] = "0";
        image[i + 1][j + 12] = "0";
        image[i + 1][j + 17] = "0";
        image[i + 1][j + 18] = "0";
        image[i + 1][j + 19] = "0";
        image[i + 2][j + 1] = "0";
        image[i + 2][j + 4] = "0";
        image[i + 2][j + 7] = "0";
        image[i + 2][j + 10] = "0";
        image[i + 2][j + 13] = "0";
        image[i + 2][j + 16] = "0";
        monsterFound = true;
      }
    }
  }
  return monsterFound;
}

let seaMonstersFound = false;
for (let i = 0; i < 4; i++) {
  image = image.map((row) => row.split(""));
  if (findSeaMonsters(image)) {
    seaMonstersFound = true;
    break;
  } else {
    image = image.map((row) => row.join(""));
    image = rotateTile(image);
  }
}

if (!seaMonstersFound) {
  image = flipTileHorizontal(image);
  for (let i = 0; i < 4; i++) {
    image = image.map((row) => row.split(""));
    if (findSeaMonsters(image)) {
      seaMonstersFound = true;
      break;
    } else {
      image = image.map((row) => row.join(""));
      image = rotateTile(image);
    }
  }
}

if (!seaMonstersFound) {
  image = flipTileHorizontal(image);
  image = flipTileVertical(image);
  for (let i = 0; i < 4; i++) {
    image = image.map((row) => row.split(""));
    if (findSeaMonsters(image)) {
      seaMonstersFound = true;
      break;
    } else {
      image = image.map((row) => row.join(""));
      image = rotateTile(image);
    }
  }
}

image = image.map((row) => row.join(""));
console.log(image);

let hashes = 0;
for (let row of image) {
  for (let char of row) {
    if (char === "#") {
      hashes++;
    }
  }
}

console.log(`Answer: ${hashes}`);
