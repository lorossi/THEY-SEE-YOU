class Sketch extends Engine {
  preload() {
    this._background_color = new Color(0, 0, 86);
    this._max_tries = 50000;
    this._min_radius = 15;
    this._max_radius = 100;
    this._max_eyes = 500;
    this._dr = 5;
    this._mouse_pos = new Position(this.width / 2, this.height / 2);

    this._duration = 900;
    this._recording = false;
  }

  setup() {
    // setup capturer
    if (this._recording) {
      this._capturer = new CCapture({ format: "png" });
      this._capturer_started = false;
    }
    // noise setup
    this._simplex = new SimplexNoise();
    // base hue setup, gives some hue_variation over each sketch
    const base_hue = random(360);
    // eyes setup
    this._eyes = [];
    let tries = 0;

    const started = performance.now();
    while (tries < this._max_tries && this._eyes.length < this._max_eyes) {
      tries++;

      const ex = random(this.width);
      const ey = random(this.height);
      const new_eye = new Eye(ex, ey, 0, base_hue);

      if (this._eyes.length == 0) {
        const r = random(this._min_radius, this._max_radius);
        new_eye.r = r;
        this._eyes.push(new_eye);
        continue;
      }

      for (let r = this._min_radius; r <= this._max_radius; r += this._dr) {
        new_eye.r = r;
        const close_eyes = this._eyes.filter(e => new_eye.isClose(e));

        if (close_eyes.length > 0) {
          if (r == this._min_radius) break;

          const closest_eye = close_eyes.sort((a, b) => (a.eyeDist(new_eye) - a.r - new_eye.r) - (b.eyeDist(new_eye) - b.r - new_eye.r))[0];
          new_eye.r = closest_eye.eyeDist(new_eye) - closest_eye.r;
          this._eyes.push(new_eye);
          tries = 0;
          break;
        }
      }
    }
    const elapsed = performance.now() - started;
    console.log("Generated", this._eyes.length, "eyes in", elapsed, "ms");
  }

  draw() {
    if (!this._capturer_started && this._recording) {
      this._capturer_started = true;
      this._capturer.start();
      console.log("%c Recording started", "color: green; font-size: 2rem");
    }

    this.ctx.save();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this._background_color.HSL;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();

    this.ctx.save();
    this._eyes.forEach(e => {
      e.move(this._mouse_pos);
      e.show(this.ctx);
    });
    this.ctx.restore();


    // handle recording
    if (this._recording) {
      if (this._frameCount <= this._duration) {
        this._capturer.capture(this._canvas);
      } else {
        this._recording = false;
        this._capturer.stop();
        this._capturer.save();
        console.log("%c Recording ended", "color: red; font-size: 2rem");
      }
    }
  }

  mousemove(e) {
    this._mouse_pos = this._calculate_press_coords(e);
  }

  click() {
    this.setup();
  }
}

const random = (a, b) => {
  if (a == undefined && b == undefined) return random(0, 1);
  else if (b == undefined) return random(0, a);
  else if (a != undefined && b != undefined) return Math.random() * (b - a) + a;
};

const random_interval = (average, interval) => {
  average = average || 0.5;
  interval = interval || 0.5;
  return random(average - interval, average + interval);
};
