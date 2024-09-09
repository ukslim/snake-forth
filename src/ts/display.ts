const GRID_SIZE = 10;
const CELL_SIZE = 40;

const colours: Record<number, string> = {
  0: "white",
  1: "green",
  2: "red",
};

// Update initial status text based on device type
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function drawState(
  ctx: CanvasRenderingContext2D,
  gridState: Uint8Array
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  gridState.forEach((value, index) => {
    const x = (index % GRID_SIZE) * CELL_SIZE;
    const y = Math.floor(index / GRID_SIZE) * CELL_SIZE;

    ctx.fillStyle = colours[value] ?? "black";
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
  });
}
