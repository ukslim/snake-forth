import WAForth from "waforth";
import { SwipeHandler } from "./swipeHandler";

const GRID_SIZE = 10;
const CELL_SIZE = 40;

const FRAME_TIME = 250;
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
    console.log("Snake game code loaded successfully");
  } catch (error) {
    console.error("Error loading snake game code:", error);
  }

  function drawState(gridState: Uint8Array) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gridState.forEach((value, index) => {
      const x = (index % GRID_SIZE) * CELL_SIZE;
      const y = Math.floor(index / GRID_SIZE) * CELL_SIZE;

      if (value === 0) {
        ctx.fillStyle = "white";
      } else {
        ctx.fillStyle = value === 1 ? "darkgreen" : "green";
      }

      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    });
  }

  const memory = forth.memory();
  forth.interpret("get-state-address");
  const gridAddress = forth.pop();
  const state = new Uint8Array(memory.buffer, gridAddress, 101);

  const startGame = () => {
    status.textContent = "";
    forth.interpret("init-game");
    let gameOver = false;

    function gameLoop() {
      if (gameOver) return;

      forth.interpret("tick");
      drawState(state.slice(1));
      gameOver = !!state[0];

      if (gameOver) {
        status.textContent = "Game Over - Tap to restart";
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

  // Update initial status text based on device type
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  status.textContent = isMobile ? "Tap to begin" : "Press Space to start";

  // Clean up function (call this when the game ends if needed)
  const cleanup = () => {
    swipeHandler.destroy();
  };
})();
