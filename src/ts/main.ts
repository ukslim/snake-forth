import WAForth from "waforth";

const GRID_SIZE = 10;
const CELL_SIZE = 40;

const FRAME_TIME = 250;
(async () => {
  // Create the UI
  document.body.innerHTML = `
    <button id="startBtn">Start Game</button>
    <canvas id="gameCanvas" width="${GRID_SIZE * CELL_SIZE}" height="${
    GRID_SIZE * CELL_SIZE
  }"></canvas>
    <pre></pre>
  `;
  const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

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
  forth.interpret("get-grid-address");
  const gridAddress = forth.pop() as number;

  startBtn.addEventListener("click", () => {
    let gameRunning = true;
    let count = 0;

    function gameLoop() {
      if (!gameRunning) return;

      forth.interpret("tick");
      const gridState = new Uint8Array(memory.buffer, gridAddress, 100);
      drawState(gridState);

      setTimeout(gameLoop, FRAME_TIME);
      if (count++ > 200) gameRunning = false; // Temporary limit to avoid infinite loops while developing
    }

    gameLoop();

    // Add event listener for arrow keys to change direction
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
        case "Escape":
          gameRunning = false;
          break;
      }
    });
  });
})();
