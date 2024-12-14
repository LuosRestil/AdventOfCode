const fs = require("fs");
const path = require("path");

function getInput(filename) {
  const baseDir = path.dirname(require.main.filename);
  return fs.readFileSync(path.join(baseDir, "inputs", filename), {
    encoding: "utf-8",
  });
}

function getAllPermutations(list) {
  if (list.length === 1) {
    return [list];
  }

  let perms = [];
  for (let i = 0; i < list.length; i++) {
    let curr = list[i];
    let remaining = getAllPermutations(list.slice(0, i).concat(list.slice(i + 1, list.length)));
    for (let perm of remaining) {
      perms.push([curr, ...perm]);
    }
  }

  return perms;
}

function getHashKey(...args) {
  return args.join(':');
}

function getNextIdx(arr, idx) {
  idx++;
  if (idx === arr.length)
    idx = 0;
  return idx;
}

function getPrevIdx(arr, idx) {
  idx--;
  if (idx < 0)
    idx = arr.length - 1;
  return idx;
}

module.exports = { getInput, getAllPermutations, getHashKey, getNextIdx, getPrevIdx };
