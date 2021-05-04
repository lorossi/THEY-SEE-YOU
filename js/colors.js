class Color {
  constructor(H, S, L, A = 1) {
    this._H = H;
    this._S = S;
    this._L = L;
    this._A = A;

    this._hue_variation = 0;
    this._ligthness_variation = 0;
  }

  _wrap(x, min = 0, max = 360) {
    const range = max - min;
    while (x < min) x += range;
    while (x > max) x -= range;

    return x;
  }

  _clamp(x, min = 0, max = 100) {
    return Math.min(max, Math.max(min, x));
  }

  get HSL() {
    const H = this._wrap(this._H + this._hue_variation);
    const L = this._clamp(this._L + this._ligthness_variation);
    return `hsla(${H}, ${this._S}%, ${L}%, ${this._A})`;
  }

  get hue_variation() {
    return this._hue_variation;
  }

  set hue_variation(v) {
    this._hue_variation = v;
  }

  get ligthness_variation() {
    return this._ligthness_variation;
  }

  set ligthness_variation(l) {
    this._ligthness_variation = l;
  }
}