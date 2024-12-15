const { getInput } = require("../../utils");

let scanners = getInput("day19sample.txt")
  .split("\n\n")
  .map((scanner) =>
    scanner
      .split("\n")
      .slice(1)
      .map((beacon) => beacon.split(",").map((num) => Number(num)))
  )
  .map(scanner => {
    return {
      scanner,
      rotations: getRotations(scanner),
      normalized: false
    }
  });

console.log(scanners);

const queue = []; // has already normalized scanners

// while (queue.length) {
//   const curr = scanners[queue.pop()];
//   for (let i = 0; i < scanners.length; i++) {
//     if (finished.has(i)) continue;
//     const other = scanners[i];
//     const rotations = getRotations(other);
//     const match = getMatch(curr, rotations);
//     if (match) {
//       scanners[i] = normalize(curr, match);
//       finished.add(i);
//       queue.push(i);
//     }
//   }
// }


function getRotations(scanner) {
  
}