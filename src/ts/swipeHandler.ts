type SwipeDirection = "up" | "down" | "left" | "right";

export class SwipeHandler {
  private touchStartX: number | null = null;
  private touchStartY: number | null = null;
  private touchStartTime: number | null = null;

  constructor(
    private onSwipe: (direction: SwipeDirection) => void,
    private onTap: () => void
  ) {
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  public init() {
    document.addEventListener("touchstart", this.handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", this.handleTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", this.handleTouchEnd, {
      passive: false,
    });
  }

  public destroy() {
    document.removeEventListener("touchstart", this.handleTouchStart);
    document.removeEventListener("touchmove", this.handleTouchMove);
    document.removeEventListener("touchend", this.handleTouchEnd);
  }

  private handleTouchStart(event: TouchEvent) {
    event.preventDefault();
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.touchStartTime = Date.now();
  }

  private handleTouchMove(event: TouchEvent) {
    event.preventDefault();
  }

  private handleTouchEnd(event: TouchEvent) {
    event.preventDefault();
    if (
      this.touchStartX === null ||
      this.touchStartY === null ||
      this.touchStartTime === null
    ) {
      return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const touchEndTime = Date.now();

    const deltaX = touchEndX - this.touchStartX;
    const deltaY = touchEndY - this.touchStartY;
    const deltaTime = touchEndTime - this.touchStartTime;

    // Check if it's a tap (short duration and small movement)
    if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      this.onTap();
    } else {
      // Determine if the swipe was primarily horizontal or vertical
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        this.onSwipe(deltaX > 0 ? "right" : "left");
      } else {
        // Vertical swipe
        this.onSwipe(deltaY > 0 ? "down" : "up");
      }
    }

    this.touchStartX = null;
    this.touchStartY = null;
    this.touchStartTime = null;
  }
}
