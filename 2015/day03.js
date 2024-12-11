const fs = require('fs');

let input = fs.readFileSync('inputs/day03.txt', 'utf8');

// visited houses are marked with "!", unvisited with "*"

// Pt. 1

let neighborhood = [["!"]];

let position = [0, 0];

for (let instruction of input) {
  if (instruction === "^") {
    // check for north
    if (!neighborhood[position[0] - 1]) {
      // add row to north
      neighborhood.unshift([]);
      for (let i = 0; i < neighborhood[1].length; i++) {
        neighborhood[0].push("*");
      }
    }
    if (position[0] !== 0) {
      position[0]--;
    }
  }

  if (instruction === "v") {
    // check for south
    if (!neighborhood[position[0] + 1]) {
      // add row to south
      neighborhood.push([]);
      for (let i = 0; i < neighborhood[neighborhood.length - 2].length; i++) {
        neighborhood[neighborhood.length - 1].push("*");
      }
    }
    position[0]++;
  }

  if (instruction === "<") {
    // check for west
    if (!neighborhood[position[0]][position[1] - 1]) {
      for (let row of neighborhood) {
        // add column to west
        row.unshift("*");
      }
    }
    if (position[1] !== 0) {
      position[1]--;
    }
  }

  if (instruction === ">") {
    // check for east
    if (!neighborhood[position[0]][position[1] + 1]) {
      // add column to east
      for (let row of neighborhood) {
        row.push("*");
      }
    }
    position[1]++;
  }

  neighborhood[position[0]][position[1]] = "!";
}

let houses = 0;

for (let row of neighborhood) {
  for (let house of row) {
    if (house === "!") {
      houses++;
    }
  }
}

console.log(`Answer: ${houses}`);

// Pt. 2

neighborhood = [["!"]];

let positions = [
  [0, 0],
  [0, 0],
];

for (let i = 0; i < input.length; i++) {
  let whichPosition = i % 2;
  let otherPosition = whichPosition === 0 ? 1 : 0;
  if (input[i] === "^") {
    // check for north
    if (!neighborhood[positions[whichPosition][0] - 1]) {
      // add row to north
      neighborhood.unshift([]);
      for (let i = 0; i < neighborhood[1].length; i++) {
        neighborhood[0].push("*");
      }
    }
    if (positions[whichPosition][0] !== 0) {
      positions[whichPosition][0]--;
    } else {
      positions[otherPosition][0]++;
    }
  }

  if (input[i] === "v") {
    // check for south
    if (!neighborhood[positions[whichPosition][0] + 1]) {
      // add row to south
      neighborhood.push([]);
      for (let i = 0; i < neighborhood[neighborhood.length - 2].length; i++) {
        neighborhood[neighborhood.length - 1].push("*");
      }
    }
    positions[whichPosition][0]++;
  }

  if (input[i] === "<") {
    // check for west
    if (!neighborhood[positions[whichPosition][0]][positions[whichPosition][1] - 1]) {
      for (let row of neighborhood) {
        // add column to west
        row.unshift("*");
      }
    }
    if (positions[whichPosition][1] !== 0) {
      positions[whichPosition][1]--;
    } else {
      positions[otherPosition][1]++;
    }
  }

  if (input[i] === ">") {
    // check for east
    if (!neighborhood[positions[whichPosition][0]][positions[whichPosition][1] + 1]) {
      // add column to east
      for (let row of neighborhood) {
        row.push("*");
      }
    }
    positions[whichPosition][1]++;
  }

  neighborhood[positions[whichPosition][0]][positions[whichPosition][1]] = "!";
}

houses = 0;

for (let row of neighborhood) {
  for (let house of row) {
    if (house === "!") {
      houses++;
    }
  }
}

console.log(`Answer: ${houses}`);
