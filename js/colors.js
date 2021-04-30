class Color {
  constructor(H, S, L) {
    this._H = H;
    this._S = S;
    this._L = L;


    this._variation = 0;
  }

  _wrap(x, min = 0, max = 360) {
    const range = max - min;
    while (x < min) x += range;
    while (x > max) x -= range;

    return x;
  }

  get HSL() {
    const H = this._wrap(this._H + this._variation);
    return `hsl(${H}, ${this._S}%, ${this._L}%)`;
  }

  get variation() {
    return this._variation;
  }

  set variation(v) {
    this._variation = v;
  }
}