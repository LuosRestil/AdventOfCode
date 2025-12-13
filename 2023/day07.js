import fs from 'fs';
const input = fs.readFileSync("inputs/day07.txt", { encoding: "utf-8" });
const hands = input.split("\n").map((hand) => hand.split(" ")); // hand [0], bid [1]
let cardStrengths = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  T: 9,
  9: 8,
  8: 7,
  7: 6,
  6: 5,
  5: 4,
  4: 3,
  3: 2,
  2: 1,
};

console.log('Answer 1: ' + getWinnings(getTypeJacks));
cardStrengths["J"] = 0;
console.log('Answer 2: ' + getWinnings(getTypeJokers));

function getWinnings(getTypeFunction) {
  let sortedHands = hands.toSorted((a, b) => {
    const aType = getTypeFunction(a[0]);
    const bType = getTypeFunction(b[0]);
    if (aType === bType) {
      let i = 0;
      while (a[0][i] === b[0][i]) {
        i++;
      }
      return cardStrengths[a[0][i]] - cardStrengths[b[0][i]];
    } else {
      return aType - bType;
    }
  });
  return sortedHands
    .map((hand, idx) => parseInt(hand[1]) * (idx + 1))
    .reduce((acc, curr) => acc + curr);
}


function getTypeJacks(hand) {
  const handMap = createHandMap(hand);
  const keys = Object.keys(handMap);
  const vals = Object.values(handMap);
  switch (keys.length) {
    case 1:
      return 7;
    case 2:
      return Math.max(...vals) === 4 ? 6 : 5;
    case 3:
      return Math.max(...vals) === 3 ? 4 : 3;
    case 4:
      return 2;
    case 5:
      return 1;
  }
}

function getTypeJokers(hand) {
  const handMap = createHandMap(hand);
  const keys = Object.keys(handMap);
  const vals = Object.values(handMap);
  let rank;
  switch (keys.length) {
    case 1:
      return 7;
    case 2:
      if (handMap["J"]) return 7;
      return Math.max(...vals) === 4 ? 6 : 5;
    case 3:
      rank = Math.max(...vals) === 3 ? 4 : 3;
      if (handMap["J"]) {
        if (rank === 4) return 6;
        if (rank === 3) return rank + (1 + handMap["J"]);
      }
      return rank;
    case 4:
      return handMap["J"] ? 4 : 2;
    case 5:
      return handMap["J"] ? 2 : 1;
  }
}

function createHandMap(hand) {
  const handMap = {};
  for (let card of hand) {
    handMap[card] = 1 + (handMap[card] ?? 0);
  }
  return handMap;
}