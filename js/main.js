import { createGameState, playRound } from "./game.js";
import { getElements, render } from "./ui.js";

let state = createGameState();
const elements = getElements();

render(state);

elements.rollButton.addEventListener("click", () => {
  state = playRound(state);
  render(state);
});

elements.resultModal.addEventListener("click", (event) => {
  if (event.target === elements.resultModal) {
    return;
  }

  if (event.target.id !== "confirm-button") {
    return;
  }

  state = createGameState();
  render(state);
  elements.rollButton.focus();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The game remains fully usable if service workers are unavailable.
    });
  });
}
