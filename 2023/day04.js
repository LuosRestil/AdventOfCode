import fs from 'fs';
const input = fs.readFileSync('inputs/day04.txt', {encoding: 'utf-8'});
const lines = input.split('\n');

let total = 0;
let cards = [];
for (let line of lines) {
  const data = line.split(': ')[1];
  const splitData = data.split('| ');
  const winning = splitData[0].trim().split(/\s+/);
  const has = splitData[1].trim().split(/\s+/);
  const matches = has.filter(num => winning.includes(num));
  if (matches.length) total += 2 ** (matches.length - 1);
  cards.push({matches, copies: 1});
}
console.log('Answer 1: ' + total);

for (let i = 0; i < cards.length; i++) {
  const card = cards[i];
  for (let j = i + 1; j < Math.min(cards.length, i + 1 + card.matches.length); j++) {
    cards[j].copies += card.copies;
  }
}
const ans = cards.map(card => card.copies).reduce((acc, curr) => acc + curr);
console.log('Answer 2: ' + ans);