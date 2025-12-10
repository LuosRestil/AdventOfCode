const fs = require("fs");

console.time();

let sleepMap = {};
const logs = fs
  .readFileSync("inputs/day04.txt", "utf-8")
  .split("\n")
  .map((line) => {
    let sp = line.split("] ");
    let guardId = sp[1].split(" ")[1];
    let timestamp = sp[0];
    timestamp = timestamp.slice(1);
    let spTime = timestamp.split(" ");
    let ymd = spTime[0].split("-").map((num) => parseInt(num));
    let hm = spTime[1].split(":").map((num) => parseInt(num));
    const date = Date.UTC(1999, ymd[1] - 1, ymd[2], hm[0], hm[1]);
    return { date, minute: hm[1], event: sp[1], guardId };
  })
  .toSorted((a, b) => a.date - b.date);

let guardId = null;
let range = { start: null, end: null };
for (let log of logs) {
  if (log.event.startsWith("Guard")) {
    if (!sleepMap[log.guardId]) sleepMap[log.guardId] = [];
    guardId = log.guardId;
  } else if (log.event === "falls asleep") {
    range.start = log.minute;
  } else {
    range.end = log.minute;
    sleepMap[guardId].push(range);
    range = { start: null, end: null };
  }
}

let longestSleep = 0;
let longestSleeper = null;
for (let [guardId, ranges] of Object.entries(sleepMap)) {
  let sleep = 0;
  for (let range of ranges) {
    sleep += range.end - range.start;
  }
  if (sleep > longestSleep) {
    longestSleep = sleep;
    longestSleeper = guardId;
  }
}

let minsMap = {};
for (let [guardId, sleeps] of Object.entries(sleepMap)) {
  let guardMins = {};
  for (let i = 0; i < 60; i++) {
    guardMins[i] = 0;
  }
  for (let sleep of sleeps) {
    for (let i = sleep.start; i < sleep.end; i++) guardMins[i]++;
  }
  minsMap[guardId] = Object.entries(guardMins).toSorted((a, b) => b[1] - a[1]);
}

let longestSleeperMins = minsMap[longestSleeper];
console.log(
  `Part 1: ${
    parseInt(longestSleeperMins[0]) * parseInt(longestSleeper.slice(1))
  }`
);
let biggestMinuteEntry = Object.entries(minsMap).toSorted(
  (a, b) => b[1][0][1] - a[1][0][1]
)[0];
console.log(
  `Part 2: ${
    parseInt(biggestMinuteEntry[0].slice(1)) *
    parseInt(biggestMinuteEntry[1][0])
  }`
);

console.timeEnd();
