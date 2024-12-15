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
      beacons: scanner,
      rotations: getScannerRotations(scanner),
      normalized: false
    }
  });

const queue = []; // recently normalized scanners
while (queue.length) {
  const scanner = scanners[queue.pop()];
  for (let i = 0; i < scanners.length; i++) {
    const other = scanners[i];
    if (other.normalized) continue;
    const match = getMatch(scanner, other.rotations);
    if (match) {
      other.beacons = normalize(scanner, match);
      other.normalized = true;
      queue.push(i);
    }
  }
}



function getScannerRotations(scanner) {
  const scannerRotations = [];
  const beaconRotations = scanner.map(beacon => getBeaconRotations(beacon));
  for (let i = 0; i < beaconRotations[0].length; i++) {
    let rotation = [];
    for (let j = 0; j < scanner.length; j++) {
      rotation.push(beaconRotations[j][i]);
    }
    scannerRotations.push(rotation);
  }
}

function getBeaconRotations(beacon) {
  const rotations = [];
  // x, y, z
  rotations.push([beacon[0], beacon[1], beacon[2]]);
  rotations.push([-beacon[0], beacon[1], beacon[2]]);
  rotations.push([beacon[0], -beacon[1], beacon[2]]);
  rotations.push([beacon[0], beacon[1], -beacon[2]]);
  rotations.push([-beacon[0], -beacon[1], beacon[2]]);
  rotations.push([-beacon[0], beacon[1], -beacon[2]]);
  rotations.push([beacon[0], -beacon[1], -beacon[2]]);
  rotations.push([-beacon[0], -beacon[1], -beacon[2]]);
  // x, z, y
  rotations.push([beacon[0], beacon[2], beacon[1]]);
  rotations.push([-beacon[0], beacon[2], beacon[1]]);
  rotations.push([beacon[0], -beacon[2], beacon[1]]);
  rotations.push([beacon[0], beacon[2], -beacon[1]]);
  rotations.push([-beacon[0], -beacon[2], beacon[1]]);
  rotations.push([-beacon[0], beacon[2], -beacon[1]]);
  rotations.push([beacon[0], -beacon[2], -beacon[1]]);
  rotations.push([-beacon[0], -beacon[2], -beacon[1]]);
  // y, x, z
  rotations.push([beacon[1], beacon[0], beacon[2]]);
  rotations.push([-beacon[1], beacon[0], beacon[2]]);
  rotations.push([beacon[1], -beacon[0], beacon[2]]);
  rotations.push([beacon[1], beacon[0], -beacon[2]]);
  rotations.push([-beacon[1], -beacon[0], beacon[2]]);
  rotations.push([-beacon[1], beacon[0], -beacon[2]]);
  rotations.push([beacon[1], -beacon[0], -beacon[2]]);
  rotations.push([-beacon[1], -beacon[0], -beacon[2]]);
  // y, z, x
  rotations.push([beacon[1], beacon[2], beacon[0]]);
  rotations.push([-beacon[1], beacon[2], beacon[0]]);
  rotations.push([beacon[1], -beacon[2], beacon[0]]);
  rotations.push([beacon[1], beacon[2], -beacon[0]]);
  rotations.push([-beacon[1], -beacon[2], beacon[0]]);
  rotations.push([-beacon[1], beacon[2], -beacon[0]]);
  rotations.push([beacon[1], -beacon[2], -beacon[0]]);
  rotations.push([-beacon[1], -beacon[2], -beacon[0]]);
  // z, x, y
  rotations.push([beacon[2], beacon[0], beacon[1]]);
  rotations.push([-beacon[2], beacon[0], beacon[1]]);
  rotations.push([beacon[2], -beacon[0], beacon[1]]);
  rotations.push([beacon[2], beacon[0], -beacon[1]]);
  rotations.push([-beacon[2], -beacon[0], beacon[1]]);
  rotations.push([-beacon[2], beacon[0], -beacon[1]]);
  rotations.push([beacon[2], -beacon[0], -beacon[1]]);
  rotations.push([-beacon[2], -beacon[0], -beacon[1]]);
  // z, y, x
  rotations.push([beacon[2], beacon[1], beacon[0]]);
  rotations.push([-beacon[2], beacon[1], beacon[0]]);
  rotations.push([beacon[2], -beacon[1], beacon[0]]);
  rotations.push([beacon[2], beacon[1], -beacon[0]]);
  rotations.push([-beacon[2], -beacon[1], beacon[0]]);
  rotations.push([-beacon[2], beacon[1], -beacon[0]]);
  rotations.push([beacon[2], -beacon[1], -beacon[0]]);
  rotations.push([-beacon[2], -beacon[1], -beacon[0]]);

  return rotations;
}

function getMatch(base, rotations) {

}