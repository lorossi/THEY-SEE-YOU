class Eye {
  constructor(x, y, r, base_hue) {
    this._pos = new Position(Math.floor(x), Math.floor(y));
    this._r = r;

    // colors
    this._inner_iris_color = new Color(base_hue, 75, 20);
    this._outer_iris_color = new Color(base_hue, 75, 40);
    this._inner_pupil_color = new Color(0, 0, 10);
    this._outer_pupil_color = new Color(0, 0, 5);
    this._eyelid_color = new Color(231, 80, 5);
    this._eyelid_border = new Color(231, 90, 5);
    this._background_color = new Color(0, 25, 95);

    // variate hue slightly
    const max_hue_variation = 15;
    this._outer_iris_color.hue_variation = random_interval(0, max_hue_variation);
    this._inner_iris_color.hue_variation = random_interval(0, max_hue_variation);

    // variable initializations
    this._open = 0;
    this._rotation = 0;
    this._eyelids_epsilon = 0.01;
    // calculate sizes and distances relative to radius
    this._calculateMeasures();
  }

  _calculateMeasures() {
    this._iris_distance = 0.4 * this._r;
    this._iris_radius = this._r - this._iris_distance;
    this._pupil_radius = this._iris_radius * 0.2;
    this._min_dist = this._r * 2;
    this._max_dist = this._r * 5;
    this._line_width = this._r / 75 * 4;
  }

  move(mouse_pos, mouse_out) {
    if (mouse_out) {
      this._open = 0;
      return;
    }

    if (mouse_pos.x == undefined || mouse_pos.y == undefined) {
      this._open = 0;
      return;
    }

    const dist = this.posDist(mouse_pos);

    if (dist > this._min_dist) {
      const percent = 1 - Math.min((dist - this._min_dist) / (this._max_dist - this._min_dist), 1);
      this._open = ease(percent);
    } else {
      this._open = 1;
    }

    if (dist < this._max_dist) this._rotation = Math.atan2(this.pos.y - mouse_pos.y, this.pos.x - mouse_pos.x) + Math.PI;
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

    // draw the iris
    ctx.save();

    // generate gradients
    const iris_gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this._iris_radius);
    iris_gradient.addColorStop(0, this._inner_iris_color.HSL);
    iris_gradient.addColorStop(1, this._outer_iris_color.HSL);
    const pupil_gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this._pupil_radius);
    pupil_gradient.addColorStop(0, this._inner_pupil_color.HSL);
    pupil_gradient.addColorStop(1, this._outer_pupil_color.HSL);

    ctx.rotate(this._rotation);
    ctx.translate(this._iris_distance, 0);

    // draw iris
    ctx.fillStyle = iris_gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this._iris_radius, 0, Math.PI * 2);
    ctx.fill();

    // draw pupil
    ctx.fillStyle = pupil_gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this._pupil_radius, 0, Math.PI * 2);
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

  get pos() {
    return this._pos;
  }

  get r() {
    return this._r;
  }

  set r(new_r) {
    // while updating the radius, also update
    // its relative measures
    this._r = new_r;
    this._calculateMeasures();
  }
}