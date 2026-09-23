let gridSerialNumber = 8772;

let grid = {};
for (let x = 1; x <= 300; x++) {
  grid[x] = {};
  for (let y = 1; y <= 300; y++) {
    grid[x][y] = getCellPower(x, y);
  }
}

let part1Max = getMaxChunkPower(3);
console.log(`Part 1: ${part1Max.maxChunk}, ${part1Max.maxChunkPower}`);

for (let chunkSize = 1; chunkSize <= 300; chunkSize++) {
  let {maxChunkPower, maxChunk} = getMaxChunkPower(chunkSize);
  console.log(maxChunkPower, maxChunk, chunkSize);
}

function getCellPower(x, y) {
  let rackId = x + 10;
  let power = rackId * y;
  power += gridSerialNumber;
  power *= rackId;
  power = getHundredsDigit(power);
  power -= 5;
  return power;
}

function getMaxChunkPower(chunkSize) {
  let maxChunkPower = -Infinity;
  let maxChunk = [-1, -1];
  for (let x = 1; x <= 300 - (chunkSize - 1); x++) {
    for (let y = 1; y <= 300 - (chunkSize - 1); y++) {
      let chunkPower = getChunkPower(x, y, chunkSize);
      if (chunkPower > maxChunkPower) {
        maxChunkPower = chunkPower;
        maxChunk = [x, y];
      }
    }
  }
  return { maxChunkPower, maxChunk };
}

function getChunkPower(x, y, chunkSize) {
  let total = 0;
  for (let i = x; i < x + chunkSize; i++) {
    for (let j = y; j < y + chunkSize; j++) {
      total += grid[i][j];
    }
  }
  return total;
}

function getHundredsDigit(num) {
  if (num < 100) return 0;
  return Math.floor(num / 100) % 10;
}
