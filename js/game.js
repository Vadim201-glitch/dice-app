import { evaluateRoll, rollDice } from "./rules.js";

export const TOTAL_ROUNDS = 3;

export function createGameState() {
  return {
    completedRounds: 0,
    currentScore: 0,
    totalScore: 0,
    lastRoll: null,
    lastResult: null,
    isComplete: false,
  };
}

export function playRound(state, random = Math.random) {
  if (state.isComplete) {
    return state;
  }

  const lastRoll = rollDice(random);
  const lastResult = evaluateRoll(lastRoll);
  const completedRounds = state.completedRounds + 1;

  return {
    completedRounds,
    currentScore: lastResult.score,
    totalScore: state.totalScore + lastResult.score,
    lastRoll,
    lastResult,
    isComplete: completedRounds === TOTAL_ROUNDS,
  };
}

export function getReward(totalScore) {
  if (totalScore >= 6) {
    return 3;
  }

  if (totalScore >= 4) {
    return 2;
  }

  if (totalScore >= 2) {
    return 1;
  }

  return 0;
}
