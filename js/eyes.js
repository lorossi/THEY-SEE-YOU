class Eye {
  constructor(x, y, r, background_color) {
    this._pos = new Position(Math.floor(x), Math.floor(y));
    this._r = r;
    this._background_color = background_color;

    this._open = 1;
    this._rotation = 0;
    this._calculateDistances();
  }

  _calculateDistances() {
    this._pupil_distance = 0.4 * this._r;
    this._minDist = this._r * 4;
    this._maxDist = this._r * 6;
  }

  move(mouse_pos) {
    this._rotation = Math.atan2(this.pos.y - mouse_pos.y, this.pos.x - mouse_pos.x) + Math.PI;

    const dist = this.posDist(mouse_pos);
    if (dist > this._minDist) {
      const percent = 1 - Math.min((dist - this._minDist) / (this._maxDist - this._minDist), 1);
      this._open = this.ease(percent);
    } else {
      this._open = 1;
    }
  }

  show(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);

    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;

    // draw close eye
    if (this._open < 1) {
      // fill the black part
      ctx.save();
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(0, 0, this._r, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();

      // fill the empty part
      for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.rotate(Math.PI * i);
        ctx.fillStyle = this._background_color;
        ctx.beginPath();
        ctx.moveTo(this._r, 0);

        for (let t = 0; t <= Math.PI; t += Math.PI / 20) {
          const vx = this._r * Math.cos(t);
          const vy = this._r * this._open * Math.sin(t);
          ctx.lineTo(vx, vy);
        }

        ctx.fill();
        ctx.restore();
      }
    }

    // draw eye circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // draw eye pupil
    ctx.save();
    ctx.rotate(this._rotation);
    ctx.translate(this._pupil_distance, 0);
    ctx.beginPath();
    ctx.arc(0, 0, this._r - this._pupil_distance, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  eyeDist(other) {
    return Math.sqrt(Math.pow(this.pos.x - other.pos.x, 2) + Math.pow(this.pos.y - other.pos.y, 2));
  }

  posDist(other_pos) {
    return Math.sqrt(Math.pow(this.pos.x - other_pos.x, 2) + Math.pow(this.pos.y - other_pos.y, 2));
  }

  isClose(other) {
    if (other == this) return false;
    return this.eyeDist(other) < (this.r + other.r);
  }

  ease(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;

  }

  get pos() {
    return this._pos;
  }

  get r() {
    return this._r;
  }

  set r(new_r) {
    this._r = new_r;
    this._calculateDistances();
  }
}