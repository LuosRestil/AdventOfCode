const { getInput } = require('../utils');

let input = getInput('day18.txt').split('\n');

function evaluateExpressionLeftToRight(expressionString) {
  // recursively evaluate parenthetical expressions
  while (expressionString.includes("(")) {
    let i = 0;
    let opening = 0;
    let openingIndex = 0;
    let closing = 0;
    let closingIndex = 0;
    while (opening !== closing || opening === 0) {
      if (expressionString[i] === "(") {
        if (opening === 0) {
          openingIndex = i;
        }
        opening++;
      } else if (expressionString[i] === ")") {
        closingIndex = i;
        closing++;
      }
      i++;
    }
    let toReplace = expressionString.slice(openingIndex, closingIndex + 1);
    expressionString = expressionString.replace(
      toReplace,
      evaluateExpressionLeftToRight(toReplace.slice(1, toReplace.length - 1))
    );
  }

  // evalute expression left to right
  expressionArr = expressionString.split(" ");
  let total = parseInt(expressionArr[0]);
  for (let i = 1; i < expressionArr.length; i += 2) {
    total = eval(`${total} ${expressionArr[i]} ${expressionArr[i + 1]}`);
  }
  return total;
}

let total = 0;
for (let line of input) {
  total += evaluateExpressionLeftToRight(line);
}

console.log(`Answer: ${total}`);

// *************************************************************************************************

function evaluateExpressionWithAdditionPrecidence(expressionString) {
  // recursively evaluate parenthetical expressions
  while (expressionString.includes("(")) {
    let i = 0;
    let opening = 0;
    let openingIndex = 0;
    let closing = 0;
    let closingIndex = 0;
    while (opening !== closing || opening === 0) {
      if (expressionString[i] === "(") {
        if (opening === 0) {
          openingIndex = i;
        }
        opening++;
      } else if (expressionString[i] === ")") {
        closingIndex = i;
        closing++;
      }
      i++;
    }
    let toReplace = expressionString.slice(openingIndex, closingIndex + 1);
    expressionString = expressionString.replace(
      toReplace,
      evaluateExpressionWithAdditionPrecidence(
        toReplace.slice(1, toReplace.length - 1)
      )
    );
  }

  // evalute expression with addition taking precedence over multiplication

  expressionArr = expressionString.split(" ").filter((item) => item !== " ");
  let i = 0;
  while (expressionArr.includes("+")) {
    if (expressionArr[i] === "+") {
      expressionArr.splice(
        i - 1,
        3,
        eval(
          `${expressionArr[i - 1]}${expressionArr[i]}${expressionArr[i + 1]}`
        ).toString()
      );
      i = 0;
    }
    i++;
  }
  let total = eval(expressionArr.join(""));
  return total;
}

total = 0;
for (let line of input) {
  total += evaluateExpressionWithAdditionPrecidence(line);
}

console.log(`Answer: ${total}`);
