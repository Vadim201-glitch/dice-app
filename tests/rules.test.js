import test from "node:test";
import assert from "node:assert/strict";

import { getLines } from "../js/board.js";
import { evaluateRoll } from "../js/rules.js";
import { createGameState, getReward, playRound, simulateGames } from "../js/game.js";

test("the board contains all 48 possible contiguous lines", () => {
  assert.equal(getLines().length, 48);
});

test("a line through the top-left happy cell scores two points", () => {
  const result = evaluateRoll([1, 4, 6]);

  assert.equal(result.score, 2);
  assert.deepEqual(result.line, [
    [0, 0],
    [0, 1],
    [0, 2],
  ]);
});

test("the best line is selected even when another line appears first", () => {
  const result = evaluateRoll([1, 2, 3]);

  assert.equal(result.score, 2);
  assert.deepEqual(result.line, [
    [4, 2],
    [4, 3],
    [4, 4],
  ]);
});

test("the central star can represent any one die", () => {
  const result = evaluateRoll([1, 1, 2]);

  assert.equal(result.score, 1);
  assert.ok(result.line.some(([row, column]) => row === 2 && column === 2));
});

test("a roll without a valid line scores zero", () => {
  const result = evaluateRoll([1, 1, 1]);

  assert.equal(result.score, 0);
  assert.deepEqual(result.line, []);
});

test("reward thresholds are applied correctly", () => {
  assert.deepEqual([0, 0, 1, 1], [
    getReward(0),
    getReward(1),
    getReward(2),
    getReward(3),
  ]);
  assert.equal(getReward(4), 2);
  assert.equal(getReward(5), 2);
  assert.equal(getReward(6), 3);
});

test("a game completes after three rounds", () => {
  let state = createGameState();
  const random = () => 0;

  state = playRound(state, random);
  state = playRound(state, random);
  state = playRound(state, random);

  assert.equal(state.completedRounds, 3);
  assert.equal(state.isComplete, true);
  assert.equal(playRound(state, random), state);
});

test("simulation returns 100 games and sums all rewards", () => {
  const values = [0, 0.5, 5 / 6];
  let index = 0;
  const random = () => values[index++ % values.length];
  const simulation = simulateGames(100, random);

  assert.equal(simulation.games.length, 100);
  assert.deepEqual(simulation.games[0], {
    gameNumber: 1,
    roundScores: [2, 2, 2],
    totalScore: 6,
    reward: 3,
  });
  assert.equal(simulation.totalCoins, 300);
});
