import { getInput } from '../utils.js';

let input = getInput('day23.txt');

input = input.split("").map((num) => parseInt(num));

const maxNum = 1_000_000;
const iterations = 10_000_000;

let circle = new Map();

// POPULATE MAP FOR PART 1
// for (let i = 0; i < input.length; i++) {
//   if (i === 0) {
//     circle.set(input[i], { left: input[input.length - 1], right: input[1] });
//   } else if (i === input.length - 1) {
//     circle.set(input[i], { left: input[i - 1], right: input[0] });
//   } else {
//     circle.set(input[i], { left: input[i - 1], right: input[i + 1] });
//   }
// }

// POPULATE MAP FOR PART 2
for (let i = 0; i < input.length; i++) {
  if (i === 0) {
    circle.set(input[i], { left: maxNum, right: input[i + 1] });
  } else if (i === input.length - 1) {
    circle.set(input[i], { left: input[i - 1], right: 10 });
  } else {
    circle.set(input[i], { left: input[i - 1], right: input[i + 1] });
  }
}
for (let i = 10; i <= maxNum; i++) {
  if (i === 10) {
    circle.set(i, { left: input[input.length - 1], right: i + 1 });
  } else if (i === maxNum) {
    circle.set(i, { left: i - 1, right: input[0] });
  } else {
    circle.set(i, { left: i - 1, right: i + 1 });
  }
}

// console.log(circle);

let current = input[0];
for (let i = 0; i < iterations; i++) {
  let removed = [];
  let searchPoint = current;
  for (let i = 0; i < 3; i++) {
    let toRight = circle.get(searchPoint).right;
    removed.push(toRight);
    searchPoint = toRight;
  }

  // current.right = removed[2].right
  let currentData = circle.get(current);
  let rightOfCurrent = circle.get(removed[2]).right;
  currentData.right = rightOfCurrent;
  circle.set(current, currentData);

  // removed[2].right.left = current
  let rightOfCurrentData = circle.get(rightOfCurrent);
  rightOfCurrentData.left = current;
  circle.set(rightOfCurrent, rightOfCurrentData);

  // get destination
  let destination = current === 1 ? maxNum : current - 1;
  while (removed.includes(destination)) {
    destination--;
    if (destination === 0) {
      destination = maxNum;
      continue;
    }
  }

  // destination.right = removed[0]
  let destinationData = circle.get(destination);
  let afterDestination = destinationData.right;
  let afterDestinationData = circle.get(afterDestination);
  destinationData.right = removed[0];
  circle.set(destination, destinationData);

  // afterdestination.left = removed[2]
  afterDestinationData.left = removed[2];
  circle.set(afterDestination, afterDestinationData);

  // removed[0].left = destination
  let firstRemovedData = circle.get(removed[0]);
  firstRemovedData.left = destination;
  circle.set(removed[0], firstRemovedData);

  // removed[2].right = afterdestination
  let lastRemovedData = circle.get(removed[2]);
  lastRemovedData.right = afterDestination;
  circle.set(removed[2], lastRemovedData);

  current = circle.get(current).right;
  // console.log(circle);
  // console.log(`removed: ${removed}`);
  // console.log(`destination: ${destination}`);
}

// PART 1 ANSWER
// let answer = "";
// current = circle.get(1).right;
// while (current !== 1) {
//   answer += current;
//   current = circle.get(current).right;
// }
// console.log(`Answer: ${answer}`);

// PART 2 ANSWER
let firstAfter1 = circle.get(1).right;
let secondAfter1 = circle.get(firstAfter1).right;
console.log(`Answer: ${firstAfter1 * secondAfter1}`);
