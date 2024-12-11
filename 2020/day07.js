const { getInput } = require("../utils");

let input = getInput("day07.txt").split("\n");

let bags = {};

// pt. 1
// for (let line of input) {
//   if (line) {
//     let key = line.split(" bags ")[0];
//     if (line.includes("no other")) {
//       bags[key] = [];
//       continue;
//     }
//     let contents = line.split(" contain ")[1];
//     contents = contents
//       .replace(/[0-9]/g, "")
//       .replace(/bags?\.?/g, "")
//       .split(",")
//       .map((item) => item.trim());
//     bags[key] = contents;
//   }
// }

// let search = [];

// function getParents(color) {
//   for (let key in bags) {
//     if (bags[key].includes(color) && !search.includes(key)) {
//       search.push(key);
//       getParents(key);
//     }
//   }
// }
// getParents("shiny gold");
// console.log(search.length);

//pt. 2
for (let line of input) {
  if (line) {
    let key = line.split(" bags ")[0];
    if (line.includes("no other")) {
      bags[key] = [];
      continue;
    }
    let contents = line.split(" contain ")[1];
    contents = contents
      .replace(/bags?\.?/g, "")
      .split(",")
      .map((item) => {
        item = item.trim();
        return { number: parseInt(item.slice(0, 1)), color: item.slice(2) };
      });
    bags[key] = contents;
  }
}

console.log(getChildren("shiny gold", 1));

function getChildren(color, number) {
  let children = bags[color];
  if (children.length === 0) {
    return number;
  }
  let total = 0;
  for (let child of children) {
    total += getChildren(child.color, child.number);
  }
  return number + number * total;
}
