import { BOARD, HAPPY_CELLS, cellKey } from "./board.js";
import { getReward } from "./game.js";

const elements = {
  board: document.querySelector("#board"),
  dice: document.querySelector("#dice"),
  roundValue: document.querySelector("#round-value"),
  roundScore: document.querySelector("#round-score"),
  totalScore: document.querySelector("#total-score"),
  roundMessage: document.querySelector("#round-message"),
  rollButton: document.querySelector("#roll-button"),
  resultModal: document.querySelector("#result-modal"),
  finalScore: document.querySelector("#final-score"),
  rewardText: document.querySelector("#reward-text"),
};

function renderBoard(result) {
  const highlighted = new Map();

  result?.line.forEach(([row, column], index) => {
    highlighted.set(cellKey(row, column), result.assignment[index]);
  });

  elements.board.replaceChildren();

  BOARD.forEach((boardRow, row) => {
    boardRow.forEach((value, column) => {
      const key = cellKey(row, column);
      const cell = document.createElement("div");
      const dieValue = highlighted.get(key);

      cell.className = "board-cell";
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `Строка ${row + 1}, столбец ${column + 1}: ${value}`);

      if (HAPPY_CELLS.has(key)) {
        cell.classList.add("is-happy");
      }

      if (value === "*") {
        cell.classList.add("is-star");
      }

      if (dieValue !== undefined) {
        cell.classList.add("is-highlighted");
      }

      const cellValue = document.createElement("span");
      cellValue.className = "cell-value";
      cellValue.textContent = value;
      cell.append(cellValue);

      if (dieValue !== undefined) {
        const dieToken = document.createElement("span");
        dieToken.className = "die-token";
        dieToken.textContent = dieValue;
        dieToken.setAttribute("aria-label", `Кубик со значением ${dieValue}`);
        cell.append(dieToken);
      }

      elements.board.append(cell);
    });
  });
}

function renderDice(roll) {
  elements.dice.replaceChildren();

  (roll ?? [null, null, null]).forEach((value, index) => {
    const die = document.createElement("span");
    die.className = `die${value === null ? " is-empty" : ""}`;
    die.textContent = value ?? "—";
    die.setAttribute("aria-label", value === null ? `Кубик ${index + 1}` : `Кубик ${index + 1}: ${value}`);
    elements.dice.append(die);
  });
}

function getRoundNumber(state) {
  return Math.min(Math.max(state.completedRounds, 1), 3);
}

function getRoundMessage(state) {
  if (!state.lastResult) {
    return "Нажмите кнопку, чтобы бросить кубики.";
  }

  if (state.currentScore === 2) {
    return "Счастливая линия найдена — 2 очка!";
  }

  if (state.currentScore === 1) {
    return "Линия найдена — 1 очко.";
  }

  return "Линию составить не удалось — 0 очков.";
}

function getButtonLabel(state) {
  if (state.isComplete) {
    return "Раунды завершены";
  }

  if (state.completedRounds === 0) {
    return "Бросить кубики";
  }

  return `Бросок раунда ${state.completedRounds + 1}`;
}

function renderFinalResult(state) {
  const reward = getReward(state.totalScore);
  elements.finalScore.textContent = state.totalScore;
  elements.rewardText.textContent = reward === 0
    ? "Выигрыша нет — 0 монет"
    : `Ваша награда — ${reward} ${reward === 1 ? "монета" : "монеты"}`;
  elements.resultModal.hidden = !state.isComplete;
}

export function render(state) {
  elements.roundValue.textContent = `${getRoundNumber(state)} / 3`;
  elements.roundScore.textContent = state.currentScore;
  elements.totalScore.textContent = state.totalScore;
  elements.roundMessage.textContent = getRoundMessage(state);
  elements.rollButton.textContent = getButtonLabel(state);
  elements.rollButton.disabled = state.isComplete;

  renderBoard(state.lastResult);
  renderDice(state.lastRoll);
  renderFinalResult(state);
}

export function getElements() {
  return elements;
}
