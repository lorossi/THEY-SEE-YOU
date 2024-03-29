class Sketch extends Engine {
  preload() {
    this._background_color = new Color(0, 0, 84);
    this._max_tries = 5000;
    this._min_radius = 15;
    this._max_radius = 100;
    this._max_eyes = 250;
    this._dr = 5;
    this._noise_radius = 0.75;

    this._duration = 600;
    this._recording = false;
    this._auto = false;
    this._show_fps = false;

    console.log("%c Curious? Check the repo! https://github.com/lorossi/THEY-CONTROL-YOU", "color: blue; font-size: 1rem");
  }

  setup() {
    // setup capturer
    this._capturer_started = false;
    if (this._recording) {
      this._capturer = new CCapture({ format: "png" });
    }
    // eyes look location
    this._mouse_pos = new Position();
    this._mouse_out = true;
    // noise setup
    this._simplex = new SimplexNoise();
    // base hue setup, gives some hue_variation over each sketch
    const base_hue = random(360);
    // eyes setup
    this._eyes = [];
    let tries = 0;
    // place eyes
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
    // pre generate gradients to ease the performances
    this._eyes.forEach(e => e.generateGradients(this.ctx));
  }

  draw() {
    if (!this._capturer_started && this._recording) {
      this._capturer_started = true;
      this._capturer.start();
      console.log("%c Recording started", "color: green; font-size: 2rem");
    }

    if (this._auto) {
      // elapsed percent
      const percent = (this.frameCount % this._duration) / this._duration;
      const time_theta = percent * Math.PI * 4;
      // noise coordinates, used to loop around
      const nx = this._noise_radius * (1 + Math.cos(time_theta));
      const ny = this._noise_radius * (1 + Math.sin(time_theta));
      // get noise and calculate the the actual mouse position
      const mx = this._simplex.noise3D(nx, ny, 1000) * this.width / 2 + this.width / 2;
      const my = this._simplex.noise3D(nx, ny, 2000) * this.height / 2 + this.height / 2;
      // update the variables
      this._mouse_pos = new Position(mx, my);
      this._mouse_out = false;
    }

    this.ctx.save();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this._background_color.HSL;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();

    this.ctx.save();
    this._eyes.forEach(e => {
      e.move(this._mouse_pos, this._mouse_out);
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

    // show fps
    if (this._show_fps) {
      const fps = Math.floor(this.frameRate);
      this.ctx.save();
      this.ctx.fillStyle = "red";
      this.ctx.font = "40px Roboto";
      this.ctx.fillText(fps, 0, 40);
      this.ctx.restore();
    }
  }

  mousemove(e) {
    if (this._auto) return;
    this._mouse_pos = this._calculate_press_coords(e);
    this._mouse_out = false;
  }

  mouseenter(e) {
    this._mouse_out = false;
  }

  mouseleave(e) {
    this._mouse_out = true;
  }

  click() {
    this.setup();
  }
}

ease = x => -(Math.cos(Math.PI * x) - 1) / 2;

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
