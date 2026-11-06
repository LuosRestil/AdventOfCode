import fs from "fs";
import path from "node:path";

console.time();

const filename = "day22.txt";

let lines = fs
  .readFileSync(path.join(import.meta.dirname, "inputs", filename), "utf-8")
  .split("\n");

let deckSize = 10007n;

let lcf = getLcfFromInput(lines, deckSize);
console.log(`Part 1: ${lcfCompute(lcf, 2019n, deckSize)}`);

deckSize = 119315717514047n;
lcf = getLcfFromInput(lines, deckSize);
lcf = powCompose(lcf, 101741582076661n, deckSize);
console.log(`Part 2: ${lcfComputeInverse(lcf, 2020n, deckSize)}`);

console.timeEnd();

function getLcfFromInput(lines, m) {
  let lcf = parseLcf(lines[0]);
  for (let i = 1; i < lines.length; i++) {
    let line = lines[i];
    let next = parseLcf(line);
    lcf = lcfCompose(lcf, next, m);
  }
  return lcf;
}

function parseLcf(line) {
  if (line.startsWith("deal into new stack")) {
    return [-1n, -1n];
  } else if (line.startsWith("cut")) {
    return [1n, -BigInt(line.split(" ")[1])];
  } else if (line.startsWith("deal with increment")) {
    return [BigInt(line.split(" ")[3]), 0n];
  } else {
    throw new Error("oh god oh fuck");
  }
}

function lcfCompose(a, b, m) {
  return [mod(a[0] * b[0], m), mod(a[1] * b[0] + b[1], m)];
}

function lcfCompute(lcf, x, m) {
  return mod(lcf[0] * x + lcf[1], m);
}

function lcfComputeInverse(lcf, x, m) {
  let numerator = x - lcf[1];
  let denominator = lcf[0];
  let denomToNeg1 = powMod(denominator, m - 2n, m);
  return mod(numerator * denomToNeg1, m);
}

function powCompose(lcf, times, m) {
  let g = [1n, 0n];
  while (times > 0n) {
    if (mod(times, 2n) !== 0n) {
      g = lcfCompose(g, lcf, m);
    }
    times = times / 2n;
    lcf = lcfCompose(lcf, lcf, m);
  }
  return g;
}

function powMod(x, n, m) {
  let y = 1n;
  while (n > 0n) {
    if (mod(n, 2n) !== 0n) {
      y = mod(y * x, m);
    }
    n = n / 2n;
    x = mod(x * x, m);
  }
  return y;
}

function mod(num, m) {
  let res = num % m;
  if (res < 0n) res += m;
  return res;
}
