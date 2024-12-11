const { getInput } = require('../utils');

let input = getInput('day13.txt').split('\n');

const earliestDeparture = input[0];
let buses = input[1].split(",");
let soonest = Infinity;
let soonestBus = 0;
for (let bus of buses) {
  bus = parseInt(bus);
  if (!isNaN(bus)) {
    let offset = earliestDeparture % bus;
    if (offset === 0) {
      console.log(`Answer: 0`);
      break;
    }
    offset -= bus;
    offset = Math.abs(offset);
    if (offset < soonest) {
      soonest = offset;
      soonestBus = bus;
    }
  }
}
console.log(`Answer: ${soonestBus * soonest}`);

// ******************************************************************

let timestamp = 1;
let incrementSize = 1;

for (let i = 0; i < buses.length; i++) {
  let bus = parseInt(buses[i]);
  if (isNaN(bus)) {
    continue;
  }
  let answerFound = false;
  while (!answerFound) {
    if (((timestamp % bus) + i) % bus == 0) {
      answerFound = true;
      incrementSize *= bus;
    } else {
      timestamp += incrementSize;
    }
  }
}

console.log(`Answer: ${timestamp}`);
