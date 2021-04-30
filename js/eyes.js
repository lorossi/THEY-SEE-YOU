class Eye {
  constructor(x, y, r, base_hue) {
    this._pos = new Position(Math.floor(x), Math.floor(y));
    this._r = r;

    this._pupil_color = new Color(base_hue, 75, 40);
    this._eyelid_color = new Color(212, 80, 5);
    this._eyelid_border = new Color(212, 90, 5);
    this._background_color = new Color(0, 25, 95);
    this._line_width = 2;

    const max_variation = 15;
    this._pupil_color.variation = random_interval(0, max_variation);

    this._open = 1;
    this._rotation = 0;
    this._eyelids_epsilon = 0.01;
    this._calculateDistances();
  }

  _calculateDistances() {
    this._pupil_distance = 0.4 * this._r;
    this._minDist = this._r * 1;
    this._maxDist = this._r * 5;
  }

  move(mouse_pos) {
    const dist = this.posDist(mouse_pos);

    if (dist > this._minDist) {
      const percent = 1 - Math.min((dist - this._minDist) / (this._maxDist - this._minDist), 1);
      this._open = this.ease(percent);
    } else {
      this._open = 1;
    }

    if (dist < this._maxDist) this._rotation = Math.atan2(this.pos.y - mouse_pos.y, this.pos.x - mouse_pos.x) + Math.PI;
    else this._rotation = 0;
  }

  show(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.lineWidth = this._line_width;

    // draw eye background
    ctx.save();
    ctx.fillStyle = this._eyelid_color.HSL;
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // give the eyelids some border
    if (this._open > this._eyelids_epsilon && this._open < (1 - this._eyelids_epsilon)) {
      const line_width = 4 * (1 - this._open);
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = this._eyelid_border.HSL;
      ctx.lineWidth = line_width;
      ctx.ellipse(0, 0, this._r - line_width, this._r * this._open + line_width / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }


    ctx.save();
    // clip the inner part of the eye so the eye can be correctly opened and closed
    ctx.beginPath();
    ctx.ellipse(0, 0, this._r, this._r * this._open, 0, 0, Math.PI * 2);
    ctx.clip();

    // color the white part
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this._background_color.HSL;
    ctx.arc(0, 0, this.r - this._line_width, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // draw the pupil
    ctx.save();
    ctx.rotate(this._rotation);
    ctx.translate(this._pupil_distance, 0);
    ctx.fillStyle = this._pupil_color.HSL;
    ctx.beginPath();
    ctx.arc(0, 0, this._r - this._pupil_distance, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();

    // draw the outline
    ctx.save();
    ctx.strokeStyle = this._eyelid_color.HSL;
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.stroke();
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