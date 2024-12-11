const { getInput } = require('../utils');

let input = getInput('day22.txt').split('\n');

let p1 = input.slice(1, input.indexOf("")).map((num) => parseInt(num));
let p2 = input.slice(input.indexOf("") + 2).map((num) => parseInt(num));

// let round = 1;
// while (p1.length > 0 && p2.length > 0) {
//   // console.log(`round ${round}`);
//   // console.log(`p1: ${p1}`);
//   // console.log(`p2: ${p2}`);
//   let p1Play = p1.shift();
//   let p2Play = p2.shift();
//   // console.log(`p1 plays: ${p1Play}`);
//   // console.log(`p2 plays: ${p2Play}`);
//   if (p1Play > p2Play) {
//     // console.log("p1 wins");
//     p1.push(p1Play);
//     p1.push(p2Play);
//   } else {
//     // console.log("p2 wins");
//     p2.push(p2Play);
//     p2.push(p1Play);
//   }
//   round++;
// }

// let total = 0;
// if (p1.length > 0) {
//   for (let i = p1.length - 1, j = 1; i >= 0; i--, j++) {
//     total += p1[i] * j;
//   }
// } else {
//   for (let i = p2.length - 1, j = 1; i >= 0; i--, j++) {
//     total += p2[i] * j;
//   }
// }

// console.log(`Answer: ${total}`);

// **********************************************************

function recursiveCombat(hand1, hand2) {
  let p1 = [...hand1];
  let p2 = [...hand2];
  let hands = [];
  let round = 1;
  while (p1.length > 0 && p2.length > 0) {
    // console.log(`round ${round}`);
    // console.log(`p1: ${p1}`);
    // console.log(`p2: ${p2}`);
    let hand = p1.toString() + "/" + p2.toString();
    if (hands.includes(hand)) {
      return { winner: "p1", hand: p1 };
    }
    hands.push(hand);
    let p1Play = p1.shift();
    let p2Play = p2.shift();
    // console.log(`p1 plays: ${p1Play}`);
    // console.log(`p2 plays: ${p2Play}`);
    let winner;
    if (p1.length >= p1Play && p2.length >= p2Play) {
      // console.log("playing subgame to determine winner...");
      winner = recursiveCombat(p1.slice(0, p1Play), p2.slice(0, p2Play)).winner;
    } else {
      if (p1Play > p2Play) {
        winner = "p1";
      } else {
        winner = "p2";
      }
    }
    if (winner === "p1") {
      p1.push(p1Play);
      p1.push(p2Play);
      // console.log("p1 wins round");
    } else {
      p2.push(p2Play);
      p2.push(p1Play);
      // console.log("p2 wins round");
    }
    round++;
  }
  // console.log("back to old game...");
  if (p1.length > 0) {
    // p1 wins
    return { winner: "p1", hand: p1 };
  } else {
    // p2 wins
    return { winner: "p2", hand: p2 };
  }
}

let winner = recursiveCombat(p1, p2);

let total = 0;
for (let i = winner.hand.length - 1, j = 1; i >= 0; i--, j++) {
  total += winner.hand[i] * j;
}

console.log(`Answer: ${total}`);
