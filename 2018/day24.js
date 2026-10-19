import fs from "fs";
import path from "node:path";

console.time();

let filename = "day24.txt";

let input = fs.readFileSync(
  path.join(import.meta.dirname, "inputs", filename),
  "utf-8",
);
let sections = input.split("\n\n");
let [IMMUNE_SYSTEM, INFECTION] = [1, 2];
let inputGroups = [];
for (let row of sections[0].split("\n").slice(1)) {
  let group = parseRow(row, IMMUNE_SYSTEM);
  inputGroups.push(group);
}
for (let row of sections[1].split("\n").slice(1)) {
  let group = parseRow(row, INFECTION);
  inputGroups.push(group);
}

let groups = copyInputGroups();
while (
  groups.filter((group) => group.army === IMMUNE_SYSTEM).length &&
  groups.filter((group) => group.army === INFECTION).length
) {
  battle();
}

console.log(
  `Part 1: ${groups.map((group) => group.units).reduce((acc, curr) => acc + curr, 0)}`,
);

groups = copyInputGroups();
groups.forEach((group) => {
  if (group.army === IMMUNE_SYSTEM) {
    group.damage += 131; // manual binary search
  }
});
while (
  groups.filter((group) => group.army === IMMUNE_SYSTEM).length &&
  groups.filter((group) => group.army === INFECTION).length
) {
  battle();
}
if (groups[0].army === IMMUNE_SYSTEM) {
  console.log(
    `Part 2: ${groups.map((group) => group.units).reduce((acc, curr) => acc + curr, 0)}`,
  );
} else {
  console.log("infection wins...");
}

console.timeEnd();

function battle() {
  groups.forEach((group) => {
    group.effectivePower = group.units * group.damage;
    group.target = null;
    group.targeted = false;
  });
  groups.sort((a, b) => {
    if (a.effectivePower == b.effectivePower) {
      return b.initiative - a.initiative;
    }
    return b.effectivePower - a.effectivePower;
  });

  selectTargets();
  groups.sort((a, b) => b.initiative - a.initiative);
  attack();

  groups = groups.filter((group) => group.units > 0);
}

function selectTargets() {
  for (let attacker of groups) {
    let maxDamage = 0;
    let targets = [];
    for (let target of groups) {
      if (attacker.army === target.army || target.targeted) continue;
      let damage = calcDamage(attacker, target);
      if (!damage) continue;
      if (damage > maxDamage) {
        maxDamage = damage;
        targets = [target];
      } else if (damage === maxDamage) {
        targets.push(target);
      }
    }
    if (!targets.length) continue;
    targets.sort((a, b) => {
      if (a.effectivePower === b.effectivePower) {
        return b.initiative - a.initiative;
      }
      return b.effectivePower - a.effectivePower;
    });
    attacker.target = targets[0];
    targets[0].targeted = true;
  }
}

function attack() {
  for (let attacker of groups) {
    if (attacker.units <= 0 || !attacker.target) continue;
    let damage = calcDamage(attacker, attacker.target);
    let unitsKilled = Math.floor(damage / attacker.target.hp);
    attacker.target.units -= unitsKilled;
  }
}

function calcDamage(attacker, target) {
  if (target.immunities.includes(attacker.damageType)) return 0;
  let damage = attacker.damage * attacker.units;
  if (target.weaknesses.includes(attacker.damageType)) {
    damage *= 2;
  }
  return damage;
}

function parseRow(row, army) {
  let nums = row
    .split(" ")
    .filter((word) => !isNaN(word))
    .map((num) => parseInt(num));
  let damageType = row.split("with an attack that does ")[1].split(" ")[1];
  let weaknesses = [];
  let immunities = [];
  let immunityWeaknessSection = row.match(/\((.*)\)/);
  if (immunityWeaknessSection) {
    let content = immunityWeaknessSection[1];
    let parts = content.split("; ");
    let types0 = parts[0].split(" ").slice(2).join(" ").split(", ");
    if (parts[0].startsWith("immune to")) {
      immunities = types0;
    } else if (parts[0].startsWith("weak to")) {
      weaknesses = types0;
    } else {
      throw new Error("parse error 0");
    }
    if (parts.length === 2) {
      let types1 = parts[1].split(" ").slice(2).join(" ").split(", ");
      if (parts[1].startsWith("immune to")) {
        immunities = types1;
      } else if (parts[1].startsWith("weak to")) {
        weaknesses = types1;
      } else {
        throw new Error("parse error 1");
      }
    }
  }
  return {
    units: nums[0],
    hp: nums[1],
    damage: nums[2],
    initiative: nums[3],
    damageType,
    weaknesses,
    immunities,
    army,
  };
}

function copyInputGroups() {
  let copy = [];
  for (let group of inputGroups) {
    copy.push({
      units: group.units,
      hp: group.hp,
      damage: group.damage,
      initiative: group.initiative,
      damageType: group.damageType,
      weaknesses: group.weaknesses,
      immunities: group.immunities,
      army: group.army,
    });
  }
  return copy;
}
