let numPlayers = 473;
let lastMarble = 70904;

console.log(`Part 1: ${playGame2(numPlayers, lastMarble)}`);
console.log(`Part 2: ${playGame2(numPlayers, lastMarble * 100)}`);

function playGame(numPlayers, lastMarble) {
  let marble = 1;
  let player = 1;
  let marbles = [0];
  let curr = 0;
  let players = Array(numPlayers).fill(0);

  while (marble <= lastMarble) {
    if (marble % 23 === 0) {
      players[player] += marble;
      let toRemove = curr - 7;
      if (toRemove < 0) {
        toRemove += marbles.length;
      }
      let removed = marbles.splice(toRemove, 1);
      players[player] += removed[0];
      curr = toRemove;
    } else {
      let next = curr + 2;
      if (next > marbles.length) {
        next -= marbles.length;
      }
      marbles.splice(next, 0, marble);
      curr = next;
    }
    player = (player + 1) % numPlayers;
    marble++;
  }

  return Math.max(...players);
}

function playGame2(numPlayers, lastMarble) {
  let marble = 1;
  let player = 1;
  let node = {val: 0, next: null, prev: null};
  node.next = node;
  node.prev = node;
  let players = Array(numPlayers).fill(0);

  while (marble <= lastMarble) {
    if (marble % 23 === 0) {
      players[player] += marble;
      for (let i = 0; i < 7; i++) {
        node = node.prev;
      }
      players[player] += node.val;
      // prev should point to next
      let prev = node.prev;
      prev.next = node.next;
      node.next.prev = prev;
      node.next = null;
      node.prev = null;
      // current should advance 1
      node = prev.next;
    } else {
      for (let i = 0; i < 1; i++) {
        node = node.next;
      }
      let newNode = {val: marble, prev: node, next: node.next};
      node.next.prev = newNode;
      node.next = newNode;
      node = node.next;
    }
    player = (player + 1) % numPlayers;
    marble++;
  }

  return Math.max(...players);
}
