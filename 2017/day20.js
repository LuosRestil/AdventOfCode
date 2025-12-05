const fs = require("fs");

class Particle {
  constructor(pos, vel, acc, idx) {
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;
    this.idx = idx;
  }

  tick() {
    this.vel = add(this.vel, this.acc);
    this.pos = add(this.pos, this.vel);
  }
}

console.time();

let particles = fs
  .readFileSync("inputs/day20.txt", "utf-8")
  .split("\n")
  .map((line, idx) => parseParticle(line, idx))
  .sort((a, b) => {
    let accMagA = mag(a.acc);
    let accMagB = mag(b.acc);
    if (accMagA !== accMagB) {
      return accMagA - accMagB;
    }
    let velMagA = mag(a.vel);
    let velMagB = mag(b.vel);
    return velMagA - velMagB;
  });
console.log(particles.slice(0, 5).map((p) => [p.idx, mag(p.acc)]));
// part 1, tried all lowest accel

let dead = new Set();
for (let iter = 0; iter < 100; iter++) {
  for (let i = 0; i < particles.length - 1; i++) {
    let p1 = particles[i];
    if (dead.has(p1)) continue;
    let p1Dead = false;
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      if (dead.has(p2)) continue;
      let dist = manhattan(p1.pos, p2.pos);
      if (dist === 0) {
        dead.add(p2);
        p1Dead = true;
      }
    }
    if (p1Dead) dead.add(p1);
  }
  for (let particle of particles) particle.tick();
}
console.log(`Part 2: ${particles.length - dead.size}`);

console.timeEnd();

function parseParticle(line, idx) {
  let groups = [...line.matchAll(/<([^>+]+)>/g)];
  let pos = groups[0][1].split(",").map((num) => parseInt(num));
  let vel = groups[1][1].split(",").map((num) => parseInt(num));
  let acc = groups[2][1].split(",").map((num) => parseInt(num));
  return new Particle(pos, vel, acc, idx);
}

function mag(vec) {
  return Math.sqrt(vec[0] ** 2 + vec[1] ** 2 + vec[2] ** 2);
}

function add(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

function manhattan(v1, v2) {
  return (
    Math.abs(v1[0] - v2[0]) + Math.abs(v1[1] - v2[1]) + Math.abs(v1[2] - v2[2])
  );
}
