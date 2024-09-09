import WAForth from "waforth";
import { drawState, isMobile } from "./display";
import { SwipeHandler } from "./swipeHandler";

const FRAME_TIME = 200;

(async () => {
  // We assume index.html has the right elements
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const status = document.getElementById("statusText") as HTMLDivElement;

  // Initialize WAForth
  const forth = new WAForth();
  await forth.load();

  // Load and interpret the snake.fs file
  try {
    const response = await fetch("snake.fs");
    const snakeCode = await response.text();
    forth.interpret(snakeCode);
  } catch (error) {
    console.error("Error loading snake game code:", error);
  }

  const memory = forth.memory();
  forth.interpret("get-state-address");
  const stateAddress = forth.pop();
  const state = new Uint8Array(memory.buffer, stateAddress, 101);

  const startGame = () => {
    status.textContent = "";
    forth.interpret("init-game");
    let gameOver = false;

    function gameLoop() {
      if (gameOver) return;

      forth.interpret("tick");
      drawState(ctx, state.slice(1));
      gameOver = !!state[0];

      if (gameOver) {
        forth.interpret("score?");
        const score = forth.pop();
        status.textContent = `Game Over - Score: ${score} - ${
          isMobile() ? "Tap" : "Space"
        } to restart`;
      } else {
        setTimeout(gameLoop, FRAME_TIME);
      }
    }

    gameLoop();
  };

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowRight":
        forth.interpret("1 direction!");
        break;
      case "ArrowLeft":
        forth.interpret("-1 direction!");
        break;
      case "ArrowUp":
        forth.interpret("-10 direction!");
        break;
      case "ArrowDown":
        forth.interpret("10 direction!");
        break;
      case " ":
        startGame();
        break;
    }
  });

  // Initialize SwipeHandler
  const swipeHandler = new SwipeHandler(
    (direction) => {
      switch (direction) {
        case "right":
          forth.interpret("1 direction!");
          break;
        case "left":
          forth.interpret("-1 direction!");
          break;
        case "up":
          forth.interpret("-10 direction!");
          break;
        case "down":
          forth.interpret("10 direction!");
          break;
      }
    },
    () => {
      // Handle tap to start/restart the game
      if (status.textContent !== "") {
        startGame();
      }
    }
  );

  swipeHandler.init();

  status.textContent = isMobile() ? "Tap to begin" : "Press Space to start";

  // Clean up function (call this when the game ends if needed)
  const cleanup = () => {
    swipeHandler.destroy();
  };
})();
