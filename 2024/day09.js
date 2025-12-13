console.time("time");

import fs from 'fs';

const filepath = "inputs/day09.txt";
const diskmap = fs.readFileSync(filepath, { encoding: "utf-8" });

function makeDiskrep(diskmap) {
  const diskrep = [];
  for (let i = 0; i < diskmap.length; i += 2) {
    const id = Math.floor(i / 2);
    const fileLen = Number(diskmap[i]);
    let last = false;
    let spaceLen = -1;
    try {
      spaceLen = Number(diskmap[i + 1]);
    } catch (err) {
      last = true;
    }
    for (let j = 0; j < fileLen; j++) {
      diskrep.push(id);
    }
    if (!last) {
      for (let j = 0; j < spaceLen; j++) {
        diskrep.push(".");
      }
    }
  }
  return diskrep;
}

let diskrep = makeDiskrep(diskmap);

let emptyPtr = 0;
let endPtr = diskrep.length - 1;
while (true) {
  while (emptyPtr <= endPtr && diskrep[emptyPtr] !== ".") {
    emptyPtr++;
  }

  if (emptyPtr < endPtr) {
    diskrep[emptyPtr] = diskrep[endPtr];
    diskrep[endPtr] = ".";
  } else {
    break;
  }

  while (endPtr > 0 && diskrep[endPtr] === ".") {
    endPtr--;
  }
}

const compacted = diskrep.filter((e) => e !== ".");
let checksum = 0;
for (let i = 0; i < compacted.length; i++) {
  checksum += i * compacted[i];
}
console.log(`Part 1: ${checksum}`);


diskrep = makeDiskrep(diskmap);

const freeSpaces = [];
const files = [];
let lastEntry = diskrep[0];
let lastStart = 0;
for (let i = 1; i < diskrep.length; i++) {
  const curr = diskrep[i];
  if (curr !== lastEntry) {
    const info = { start: lastStart, len: i - lastStart };
    if (lastEntry === ".") {
      freeSpaces.push(info);
    } else {
      files.push(info);
    }
    lastStart = i;
    lastEntry = curr;
  }
}
const finalInfo = { start: lastStart, len: diskrep.length - lastStart };
files.push(finalInfo);

for (let i = files.length - 1; i >= 0; i--) {
  const file = files[i];
  for (const freeSpace of freeSpaces) {
    if (freeSpace.start > file.start) break;
    if (freeSpace.len < file.len) continue;
    else {
      // write file to empty space
      for (let j = freeSpace.start; j < freeSpace.start + file.len; j++) {
        diskrep[j] = i;
      }
      // update free space
      freeSpace.start += file.len;
      freeSpace.len -= file.len;
      // write free space where file was
      for (let j = file.start; j < file.start + file.len; j++) {
        diskrep[j] = ".";
      }
      break;
    }
  }
}

checksum = 0;
for (let i = 0; i < diskrep.length; i++) {
  if (diskrep[i] !== '.') {
    checksum += i * diskrep[i];
  }
}
console.log(`Part 2: ${checksum}`);

console.timeEnd("time");
