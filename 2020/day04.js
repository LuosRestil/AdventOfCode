import { getInput } from '../utils.js';

let input = getInput('day04.txt').split('\n');

let finalData = [];
let currentObject = {};
for (let line of input) {
  if (line === "") {
    finalData.push(currentObject);
    currentObject = {};
    continue;
  }
  line = line.split(" ");
  for (let datum of line) {
    datum = datum.split(":");
    currentObject[datum[0]] = datum[1];
  }
}
finalData.push(currentObject);

let valid = 0;
for (let obj of finalData) {
  if (Object.keys(obj).length === 8) {
    valid++;
  } else if (Object.keys(obj).length === 7 && !obj.cid) {
    valid++;
  }
}

console.log(`Answer: ${valid}`);

// *******************************************************

valid = 0;

for (let obj of finalData) {
  if (!obj.byr || parseInt(obj.byr) < 1920 || parseInt(obj.byr) > 2002) {
    continue;
  }
  if (!obj.iyr || parseInt(obj.iyr) < 2010 || parseInt(obj.iyr) > 2020) {
    continue;
  }
  if (!obj.eyr || parseInt(obj.eyr) < 2020 || parseInt(obj.eyr) > 2030) {
    continue;
  }
  if (!obj.hgt) {
    continue;
  }
  let hgtUnit = obj.hgt.slice(obj.hgt.length - 2);
  if (hgtUnit !== "cm" && hgtUnit !== "in") {
    continue;
  }
  let hgtVal = parseInt(obj.hgt.slice(0, obj.hgt.length - 2));
  if (hgtUnit === "cm" && (hgtVal < 150 || hgtVal > 193)) {
    continue;
  } else if (hgtUnit === "in" && (hgtVal < 59 || hgtVal > 76)) {
    continue;
  }
  if (!obj.hcl || !/^#[0-9a-f]{6}$/.test(obj.hcl)) {
    continue;
  }
  let eyeColors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
  if (!obj.ecl || !eyeColors.includes(obj.ecl)) {
    continue;
  }
  if (!obj.pid || !/^[0-9]{9}$/.test(obj.pid)) {
    continue;
  }
  valid++;
}

console.log(`Answer: ${valid}`);
