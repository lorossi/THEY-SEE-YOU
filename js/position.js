class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get pos() {
    return { x: this.x, y: this.y };
  }

  set pos(p) {
    this.x = p.x;
    this.y = p.y;
  }
}
