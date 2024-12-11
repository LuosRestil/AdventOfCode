const input = 33100000;

// Pt. 1
let houses = new Array(input/10).fill(0);
for (let i = 1; i < input/10; i++) {
  for (let j = i; j < input/10; j += i) {
    houses[j] += i * 10;
  }
  if (houses[i] >= input) {
    console.log(`Answer: ${i}`);
    break;
  }
}

// Pt. 2
houses = new Array(input/10).fill(0);
for (let i = 1; i < input/10; i++) {
  for (let j = i, iterations = 0; j < input/10 && iterations < 50; j += i, iterations += 1) {
    houses[j] += i * 11;
  }
  if (houses[i] >= input) {
    console.log(`Answer: ${i}`);
    break;
  }
}