import { BOARD, HAPPY_CELLS, cellKey, getLines } from "./board.js";

const LINES = getLines();

function permutations(values) {
  if (values.length <= 1) {
    return [values];
  }

  const result = [];

  values.forEach((value, index) => {
    const remainder = [...values.slice(0, index), ...values.slice(index + 1)];
    permutations(remainder).forEach((permutation) => {
      result.push([value, ...permutation]);
    });
  });

  return result;
}

function getValidAssignment(dice, line) {
  return permutations(dice).find((assignment) =>
    line.every(([row, column], index) => {
      const cellValue = BOARD[row][column];
      return cellValue === "*" || cellValue === assignment[index];
    }),
  );
}

function isHappyLine(line) {
  return line.some(([row, column]) => HAPPY_CELLS.has(cellKey(row, column)));
}

export function evaluateRoll(dice) {
  if (
    !Array.isArray(dice) ||
    dice.length !== 3 ||
    dice.some((value) => !Number.isInteger(value) || value < 1 || value > 6)
  ) {
    throw new Error("A roll must contain three integers from 1 to 6.");
  }

  let bestResult = {
    score: 0,
    line: [],
    assignment: [],
  };

  for (const line of LINES) {
    const assignment = getValidAssignment(dice, line);

    if (assignment) {
      const result = {
        score: isHappyLine(line) ? 2 : 1,
        line,
        assignment,
      };

      if (result.score > bestResult.score) {
        bestResult = result;
      }

      if (bestResult.score === 2) {
        break;
      }
    }
  }

  return bestResult;
}

export function rollDice(random = Math.random) {
  return Array.from({ length: 3 }, () => Math.floor(random() * 6) + 1);
}
