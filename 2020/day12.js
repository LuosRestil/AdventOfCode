const { getInput } = require('../utils');

let input = getInput('day12.txt').split('\n');

let shipFacing = "E";
let ewTotal = 0;
let nsTotal = 0;

let directionsCycle = ["N", "E", "S", "W"];

for (let instruction of input) {
  let direction = instruction[0];
  let distance = parseInt(instruction.slice(1));

  if (direction === "F") {
    direction = shipFacing;
  }

  if (direction === "E") {
    ewTotal += distance;
  } else if (direction === "W") {
    ewTotal -= distance;
  } else if (direction === "N") {
    nsTotal += distance;
  } else if (direction === "S") {
    nsTotal -= distance;
  } else {
    let degrees = distance;
    let currentDirectionIndex = directionsCycle.indexOf(shipFacing);
    while (degrees > 0) {
      degrees -= 90;
      if (direction === "L") {
        currentDirectionIndex -= 1;
        if (currentDirectionIndex < 0) {
          currentDirectionIndex = directionsCycle.length - 1;
        }
      } else {
        currentDirectionIndex += 1;
        if (currentDirectionIndex === directionsCycle.length) {
          currentDirectionIndex = 0;
        }
      }
    }
    shipFacing = directionsCycle[currentDirectionIndex];
  }
}
console.log(`Answer: ${Math.abs(ewTotal) + Math.abs(nsTotal)}`);

// **************************************************************************

let shipEW = 0;
let shipNS = 0;
let waypointEW = 10;
let waypointNS = 1;

for (let instruction of input) {
  // console.log(instruction);
  let direction = instruction[0];
  let distance = parseInt(instruction.slice(1));

  if (direction === "F") {
    shipEW += waypointEW * distance;
    shipNS += waypointNS * distance;
  } else if (direction === "N") {
    waypointNS += distance;
  } else if (direction === "S") {
    waypointNS -= distance;
  } else if (direction === "E") {
    waypointEW += distance;
  } else if (direction === "W") {
    waypointEW -= distance;
  } else {
    let degrees = distance;
    while (degrees >= 360) {
      degrees -= 360;
    }
    if (degrees === 270) {
      let temp = waypointEW;
      waypointEW = waypointNS;
      waypointNS = temp;
      if (direction === "R") {
        waypointEW *= -1;
      } else {
        waypointNS *= -1;
      }
    } else if (degrees === 180) {
      waypointEW *= -1;
      waypointNS *= -1;
    } else if (degrees === 90) {
      let temp = waypointEW;
      waypointEW = waypointNS;
      waypointNS = temp;
      if (direction === "R") {
        waypointNS *= -1;
      } else {
        waypointEW *= -1;
      }
    }
  }
}

console.log(`Answer: ${Math.abs(shipNS) + Math.abs(shipEW)}`);
