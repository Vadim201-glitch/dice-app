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

export function simulateGames(gameCount = 100, random = Math.random) {
  if (!Number.isInteger(gameCount) || gameCount < 1) {
    throw new Error("The number of simulated games must be a positive integer.");
  }

  const games = [];

  for (let gameNumber = 1; gameNumber <= gameCount; gameNumber += 1) {
    const roundScores = [];

    for (let round = 0; round < TOTAL_ROUNDS; round += 1) {
      const result = evaluateRoll(rollDice(random));
      roundScores.push(result.score);
    }

    const totalScore = roundScores.reduce((sum, score) => sum + score, 0);

    games.push({
      gameNumber,
      roundScores,
      totalScore,
      reward: getReward(totalScore),
    });
  }

  return {
    games,
    totalCoins: games.reduce((sum, game) => sum + game.reward, 0),
  };
}
