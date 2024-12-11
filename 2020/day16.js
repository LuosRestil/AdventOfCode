const { getInput } = require("../utils");

const input = getInput("day16.txt").split("\n\n");

let fields = input[0]
  .split("\n")
  .map((field) => field.split(":"))
  .map((field) => [field[0], field[1].trim().split(" ")]);

let myTicket = input[1]
  .split("\n")[1]
  .split(",")
  .map((num) => parseInt(num));

let otherTickets = input[2]
  .split("\n")
  .slice(1)
  .map((row) => row.split(",").map((num) => parseInt(num)));

let errorRate = 0;
let validTickets = [];
let invalidTickets = 0;

for (let ticket of otherTickets) {
  let ticketValid = true;
  for (let num of ticket) {
    let numValid = false;
    for (let field of fields) {
      field = field[1];
      let condition1 = field[0].split("-");
      let condition2 = field[2].split("-");
      let min1 = condition1[0];
      let max1 = condition1[1];
      let min2 = condition2[0];
      let max2 = condition2[1];
      if ((num >= min1 && num <= max1) || (num >= min2 && num <= max2)) {
        numValid = true;
        break;
      }
    }
    if (!numValid) {
      invalidTickets++;
      errorRate += num;
      ticketValid = false;
    }
  }
  if (ticketValid) {
    validTickets.push(ticket);
  }
}

console.log(`Answer: ${errorRate}`);

// *****************************************************************

let possibilities = [];
for (let position = 0; position < validTickets[0].length; position++) {
  let possible = [];
  for (let ticket = 0; ticket < validTickets.length; ticket++) {
    let num = validTickets[ticket][position];
    let curr = [];
    for (let field of fields) {
      let condition1 = field[1][0].split("-");
      let condition2 = field[1][2].split("-");
      let min1 = condition1[0];
      let max1 = condition1[1];
      let min2 = condition2[0];
      let max2 = condition2[1];
      if ((num >= min1 && num <= max1) || (num >= min2 && num <= max2)) {
        curr.push(field[0]);
      }
    }
    if (ticket === 0) {
      possible = curr;
    } else {
      // possible = intersection of possible and curr
      possible = possible.filter((value) => curr.includes(value));
    }
  }
  possibilities.push(possible);
}

let discovered = [];
let numDiscovered = 0;
while (numDiscovered < fields.length) {
  for (let i = 0; i < possibilities.length; i++) {
    if (possibilities[i].length === 1) {
      discovered[i] = possibilities[i][0];
      numDiscovered++;
      for (let j = 0; j < possibilities.length; j++) {
        possibilities[j] = possibilities[j].filter(
          (item) => item !== discovered[i]
        );
      }
      break;
    }
  }
}

let departureValuesProduct = 1;

for (let i = 0; i < discovered.length; i++) {
  if (discovered[i].includes("departure")) {
    departureValuesProduct *= myTicket[i];
  }
}

console.log(`Answer: ${departureValuesProduct}`);
