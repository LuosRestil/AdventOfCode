const { getInput } = require("../utils");

let input = getInput('day01.txt').split('\n').map(num => parseInt(num));

let map = {};
let target = 2020;
for (let num of input) {
  let diff = target - num;
  if (map[diff]) {
    console.log(`Answer: ${diff * num}`);
    break;
  } else {
    map[num] = true;
  }
}

// *****************************************************************

input = input.sort((a, b) => a - b);
for (let i = 0; i < input.length - 2; i++) {
  let p1 = i + 1;
  let p2 = input.length - 1;
  let diff = target - input[i];
  while (p1 < p2) {
    let subtotal = input[p1] + input[p2];
    if (subtotal === diff) {
      console.log(`Answer: ${input[i] * input[p1] * input[p2]}`);
      break;
    } else if (subtotal < diff) {
      p1++;
    } else {
      p2--;
    }
  }
}
