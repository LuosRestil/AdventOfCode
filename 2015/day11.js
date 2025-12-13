import fs from 'fs';

let password = fs.readFileSync('inputs/day11.txt', 'utf8');

function incrementPassword(password) {
  password = password.split('');
  let indexToIncrement = password.length - 1;
  while (true) {
    if (password[indexToIncrement] === 'z') {
      password[indexToIncrement] = 'a';
      indexToIncrement -= 1;
      if (indexToIncrement === -1) {
        indexToIncrement = password.length - 1;
      }
    } else {
      password[indexToIncrement] = getNextChar(password[indexToIncrement]);
      return password.join('');
    }
  }
}

function getNextChar(char) {
  return String.fromCharCode(char.charCodeAt(0) + 1);
}

function isValid(password) {
  if (hasThreeIncreasing(password) && 
hasTwoDifferentNonoverlappingPairs(password)) {
    return true;
  }
  return false;
}

function hasThreeIncreasing(password) {
  for (let i = 0; i < password.length - 2; i++) {
    if (password[i].charCodeAt(0) === password[i + 1].charCodeAt(0) - 1 && password[i + 1].charCodeAt(0) === password[i + 2].charCodeAt(0) - 1) {
      return true;
    }
  }
  return false;
}

function forbiddenChar(password) {
  const forbiddenChars = ['i', 'o', 'l'];
  for (let char of password) {
    if (forbiddenChars.includes(char)) {
      return password.indexOf(char);
    }
  }
  return null;
}

function hasTwoDifferentNonoverlappingPairs(password) {
  let pairs = 0;
  for (let i = 0; i < password.length - 1; i++) {
    if (password[i] === password[i + 1]) {
      pairs++;
      i++;
    }
  }
  return pairs >= 2;
}

while(true) {
  password = incrementPassword(password);
  let forbiddenCharIndex = forbiddenChar(password);
  if (forbiddenCharIndex) {
    password = password.split('');
    password[forbiddenCharIndex] = getNextChar(password[forbiddenCharIndex]);
    password = password.join('');
  }
  if (isValid(password)) {
    break;
  }
}

console.log(`Answer: ${password}`);

// Pt. 2

while(true) {
  password = incrementPassword(password);
  let forbiddenCharIndex = forbiddenChar(password);
  if (forbiddenCharIndex) {
    password = password.split('');
    password[forbiddenCharIndex] = getNextChar(password[forbiddenCharIndex]);
    password = password.join('');
  }
  if (isValid(password)) {
    break;
  }
}

console.log(`Answer: ${password}`);