import fs from 'fs';

console.time();

const lines = fs.readFileSync("inputs/day11.txt", "utf-8").split("\n");

let connections = {};
let reverseConnections = {};
for (let line of lines) {
  const sp = line.split(": ");
  const from = sp[0];
  const to = sp[1].split(" ");
  for (let node of to) {
    if (!connections[from]) connections[from] = [];
    connections[from].push(node);
    if (!reverseConnections[node]) reverseConnections[node] = [];
    reverseConnections[node].push(from);
  }
}

console.log(`Part 1: ${countConnections("you", "out", connections, {})}`);
// NO CONNECTIONS from 'dac' to 'fft', so we must go to 'fft' first, svr -> fft -> dac -> out
const svrToFft = countConnections("fft", "svr", reverseConnections, {});
const fftToDac = countConnections("fft", "dac", connections, {});
const dacToOut = countConnections("dac", "out", connections, {});
console.log(`Part 2: ${svrToFft * fftToDac * dacToOut}`);

console.timeEnd();

function countConnections(from, to, connectionsMap, memo) {
  if (from === to) {
    memo[from] = 1;
    return 1;
  }

  let total = 0;
  let connections = connectionsMap[from] ?? [];
  for (let connection of connections) {
    total += memo[connection]
      ? memo[connection]
      : countConnections(connection, to, connectionsMap, memo);
  }
  memo[from] = total;
  return total;
}
