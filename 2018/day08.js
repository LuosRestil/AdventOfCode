import fs from "fs";
import path from "node:path";

console.time();

const input = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", "day08.txt"), "utf-8")
  .split(" ")
  .map((num) => parseInt(num));

let ptr = 0;
let root = getNode(input, ptr);

console.log(`Part 1: ${getRawMetadataValue(root)}`);
console.log(`Part 2: ${getDerivedMetadataValue(root)}`);

console.timeEnd();

function getNode() {
  let childCount = input[ptr++];
  let metadataCount = input[ptr++];
  let children = [];
  let metadata = [];
  let name = ptr;
  for (let i = 0; i < childCount; i++) {
    children.push(getNode());
  }
  for (let i = 0; i < metadataCount; i++) {
    metadata.push(input[ptr++]);
  }
  return { children, metadata };
}

function getRawMetadataValue(node) {
  let total = node.metadata.reduce((acc, curr) => acc + curr, 0);
  for (let child of node.children) {
    total += getRawMetadataValue(child);
  }
  return total;
}

function getDerivedMetadataValue(node) {
  if (node.derivedMetadataValue === undefined) {
    let total = 0;
    if (!node.children.length) {
      total = node.metadata.reduce((acc, curr) => acc + curr, 0);
    } else {
      for (let idx of node.metadata) {
        if (node.children[idx-1]) {
          total += getDerivedMetadataValue(node.children[idx-1]);
        }
      }
    }
    node.derivedMetadataValue = total;
  }
  return node.derivedMetadataValue;
}
