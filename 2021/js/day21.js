import { getInput } from "../../utils.js";

const input = getInput('day21.txt').split('\n');
const p1StartPos = parseInt(input[0][input[0].length - 1]);
const p2StartPos = parseInt(input[1][input[1].length - 1]);

// Pt. 1
let p1 = {space: p1StartPos, score: 0};
let p2 = {space: p2StartPos, score: 0};
let dieVal = 1
let rolls = 0;
let players = [p1, p2];
let activePlayer = 0;

while (p1.score < 1000 && p2.score < 1000) {
  let player = players[activePlayer];
  for (let i = 0; i < 3; i++) {
    rolls++;
    player.space += dieVal;
    dieVal++;
    if (dieVal > 100) {
      dieVal = 1;
    }
  }
  while (player.space > 10) {
    player.space -= 10;
  }
  player.score += player.space;
  activePlayer = activePlayer === 0 ? 1 : 0;
}

console.log('Answer1: ' + players[activePlayer].score * rolls);

// *******************************************************************

// Pt. 2
console.time('playDirac');
let answer = playDirac([{score: 0, pos: 8}, {score: 0, pos: 9}], 0, 0);
console.log(answer);
console.timeEnd('playDirac');

// returns [p1wins, p2wins]
function playDirac(playerData, activePlayer, level) {
  let player = playerData[activePlayer];
  let playerOriginalPos = player.pos;
  let nextActivePlayer = activePlayer === 0 ? 1 : 0;
  let wins = [0, 0]

  // simulate possible rolls
  let finalPositionsObj = {};
  finalPositionsObj[playerOriginalPos + 3 > 10 ? playerOriginalPos + 3 - 10 : playerOriginalPos + 3] = 1;
  finalPositionsObj[playerOriginalPos + 4 > 10 ? playerOriginalPos + 4 - 10 : playerOriginalPos + 4] = 3;
  finalPositionsObj[playerOriginalPos + 5 > 10 ? playerOriginalPos + 5 - 10 : playerOriginalPos + 5] = 6;
  finalPositionsObj[playerOriginalPos + 6 > 10 ? playerOriginalPos + 6 - 10 : playerOriginalPos + 6] = 7;
  finalPositionsObj[playerOriginalPos + 7 > 10 ? playerOriginalPos + 7 - 10 : playerOriginalPos + 7] = 6;
  finalPositionsObj[playerOriginalPos + 8 > 10 ? playerOriginalPos + 8 - 10 : playerOriginalPos + 8] = 3;
  finalPositionsObj[playerOriginalPos + 9 > 10 ? playerOriginalPos + 9 - 10 : playerOriginalPos + 9] = 1;
  let finalPositionsArr = Object.entries(finalPositionsObj).sort((a, b) => b[0] - a[0]);

  for (let pos of finalPositionsArr) {
    pos[0] = parseInt(pos[0]);
    if (player.score + pos[0] >= 21) {
      wins[activePlayer] += pos[1];
    } else {
      let p1 = JSON.parse(JSON.stringify(playerData[0]));
      let p2 = JSON.parse(JSON.stringify(playerData[1]));
      if (activePlayer === 0) {
        p1.score += pos[0];
        p1.pos = pos[0];
      } else {
        p2.score += pos[0];
        p2.pos = pos[0];
      }
      let played = playDirac([p1, p2], nextActivePlayer, level + 1);
      wins[0] += played[0] * pos[1];
      wins[1] += played[1] * pos[1];
    }
  }

  return wins;
}
