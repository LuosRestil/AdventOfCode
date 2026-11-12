import fs from "fs";
import path from "node:path";

console.time();

const filename = "day20.txt";

let modules = {};
fs.readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n")
  .forEach((row) => {
    let module = {};
    let lr = row.split(" -> ");
    if (lr[0] !== "broadcaster") {
      module.type = lr[0][0];
    } else {
      module.type = lr[0];
    }
    if (module.type === "%") {
      module.on = false;
    }
    module.children = lr[1].split(", ");
    if (module.type === "broadcaster") {
      modules[lr[0]] = module;
    } else {
      modules[lr[0].slice(1)] = module;
    }
  });
for (let key in modules) {
  let module = modules[key];
  if (module.type === "&") {
    module.parents = {};
    for (let k in modules) {
      let other = modules[k];
      if (other.children.includes(key)) {
        module.parents[k] = 0;
      }
    }
  }
}

// pt 2 looks for rx low pulse. rx has one parent, gq
let gqParents = { xj: null, qs: null, kz: null, km: null };

let pulses = [0, 0];
let i = 0;
while (i < 1000) {
  tick();
  i++;
}
console.log(`Part 1: ${pulses[0] * pulses[1]}`);

while (Object.values(gqParents).some(val => val === null)) {
  tick();
  i++;
}

// gqParents loop sizes are all prime
console.log(`Part 2: ${Object.values(gqParents).reduce((acc, curr) => acc * curr, 1)}`);

console.timeEnd();

function tick() {
  let q = [["broadcaster", 0, null]];
  while (q.length) {
    let curr = q.shift();
    let name = curr[0];
    let val = curr[1];
    let from = curr[2];
    pulses[val]++;
    let module = modules[name];
    if (!module) continue;
    if (module.type === "broadcaster") {
      for (let child of module.children) {
        q.push([child, 0, name]);
      }
    } else if (module.type === "%") {
      if (val === 1) continue;
      module.on = !module.on;
      let pulse = module.on ? 1 : 0;
      for (let child of module.children) {
        q.push([child, pulse, name]);
      }
    } else if (module.type === "&") {
      module.parents[from] = val;
      let pulse = 1;
      if (Object.values(module.parents).every((pval) => pval)) {
        pulse = 0;
      }
      if (gqParents[name] === null && pulse === 1) {
        gqParents[name] = i + 1;
      }
      for (let child of module.children) {
        q.push([child, pulse, name]);
      }
    } else {
      console.log("oh god oh fuck");
    }
  }
}
