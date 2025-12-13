import { getInput } from '../utils.js';

const input = getInput('day25.txt').split('\n');

let cardPublicKey = parseInt(input[0]);
let doorPublicKey = parseInt(input[1]);

let cardLoopSize = 0;
let doorLoopSize = 0;

let cardSubjectNumber = 1;
while (cardSubjectNumber !== cardPublicKey) {
  cardSubjectNumber *= 7;
  cardSubjectNumber %= 20201227;
  cardLoopSize++;
}

let doorSubjectNumber = 1;
while (doorSubjectNumber !== doorPublicKey) {
  doorSubjectNumber *= 7;
  doorSubjectNumber %= 20201227;
  doorLoopSize++;
}

let encryptionKey = 1;
for (let i = 0; i < cardLoopSize; i++) {
  encryptionKey *= doorPublicKey;
  encryptionKey %= 20201227;
}

console.log(`Answer: ${encryptionKey}`);
