export const BOARD = [
  [1, 6, 4, 5, 3],
  [2, 5, 3, 6, 1],
  [3, 4, "*", 5, 6],
  [4, 3, 2, 4, 1],
  [5, 2, 1, 3, 2],
];

export const BOARD_SIZE = BOARD.length;
export const HAPPY_CELLS = new Set(["0,0", "4,4"]);

export function cellKey(row, column) {
  return `${row},${column}`;
}

export function getLines() {
  const lines = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column <= BOARD_SIZE - 3; column += 1) {
      lines.push([
        [row, column],
        [row, column + 1],
        [row, column + 2],
      ]);
    }
  }

  for (let column = 0; column < BOARD_SIZE; column += 1) {
    for (let row = 0; row <= BOARD_SIZE - 3; row += 1) {
      lines.push([
        [row, column],
        [row + 1, column],
        [row + 2, column],
      ]);
    }
  }

  for (let row = 0; row <= BOARD_SIZE - 3; row += 1) {
    for (let column = 0; column <= BOARD_SIZE - 3; column += 1) {
      lines.push([
        [row, column],
        [row + 1, column + 1],
        [row + 2, column + 2],
      ]);
    }

    for (let column = 2; column < BOARD_SIZE; column += 1) {
      lines.push([
        [row, column],
        [row + 1, column - 1],
        [row + 2, column - 2],
      ]);
    }
  }

  return lines;
}
