class Sketch extends Engine {
  preload() {
    // list of paintings path and pixel coords and radius of the eys
    this._paintings = [
      {
        "path": "js/paintings/mona-lisa.jpg",
        "eyes": [
          { x: 556, y: 475, r: 35 },
          { x: 700, y: 474, r: 45 },
        ]
      },
      {
        "path": "js/paintings/american-gothic.jpg",
        "eyes": [
          { x: 449, y: 724, r: 35 },
          { x: 576, y: 736, r: 30 },
          { x: 1215, y: 524, r: 35 },
          { x: 1389, y: 524, r: 40 },
        ]
      },
      {
        "path": "js/paintings/girl-pearl-earring.jpg",
        "eyes": [
          { x: 592, y: 765, r: 35 },
          { x: 778, y: 804, r: 55 },
        ]
      },
      {
        "path": "js/paintings/vertumno.jpg",
        "eyes": [
          { x: 650, y: 566, r: 45 },
          { x: 885, y: 554, r: 50 },
        ]
      },
      {
        "path": "js/paintings/scream.jpg",
        "eyes": [
          { x: 825, y: 1139, r: 30 },
          { x: 909, y: 1138, r: 30 },
        ]
      },
      {
        "path": "js/paintings/self-portrait.jpg",
        "eyes": [
          { x: 656, y: 762, r: 55 },
          { x: 868, y: 760, r: 55 },
        ]
      },
    ];
    shuffle_array(this._paintings);
    // keep track of the current painting
    this._current_painting = 0;
    // automatic movement
    this._auto = false;
    // recording related variables
    this._recording = false;
    this._duration = 600;
    this._eyes_rotations = 3;
    // some advertising
    console.clear();
    console.log("%c Snooping around? Check the repo! https://github.com/lorossi/duchampesque-art", "color: rgb(220, 220, 220); font-size: 1rem");
  }

  async setup() {
    // stop looping until the final image is loaded
    this._loaded = false;
    this.noLoop();

    this._center = { x: 0, y: 0 };

    // load image and calculate its aspect ratio
    this._image = await this._loadImage(this._paintings[this._current_painting].path);
    this._image_ratio = Math.min(this.width, this.height) / Math.max(this._image.width, this._image.height);
    // calculate actual image size on canvas
    this._dest_width = this._image.width * this._image_ratio;
    this._dest_height = this._image.height * this._image_ratio;
    // calculate displacement (border)
    this._dx = (this.width - this._dest_width) / 2;
    this._dy = (this.height - this._dest_height) / 2;
    // now the fun part begins
    this._eyes = [];
    this._paintings[this._current_painting].eyes.forEach(e => {
      // calculate actual eyes size and position
      const e_x = e.x * this._image_ratio + this._dx;
      const e_y = e.y * this._image_ratio + this._dy;
      const e_r = e.r * this._image_ratio;
      // append to eyes array
      const new_eye = new Eye(e_x, e_y, e_r);
      this._eyes.push(new_eye);
      // calculate eyes average positon
      this._center.x += e_x;
      this._center.y += e_y;
    });
    this._center.x /= this._eyes.length;
    this._center.y /= this._eyes.length;
    this._rho = this.width / 4;

    this._loaded = true;
    this.loop();

    // setup capturer
    if (this._recording) {
      this._capturer = new CCapture({ format: "png" });
      this._capturer_started = false;
    }
  }

  draw() {
    // wait until the image is loaded
    if (!this._loaded) return;

    // setup capturer
    if (!this._capturer_started && this._recording) {
      this._capturer_started = true;
      this._capturer.start();
      console.log("%c Recording started", "color: green; font-size: 1rem");
    }

    // movement calculation  
    if (this._auto) {
      // time related constants
      const percent = (this.frameCount % this._duration) / this._duration;
      const eased = ease(percent);
      const time_theta = eased * Math.PI * 2 * this._eyes_rotations + Math.PI / 2;
      // actual coords
      const blend = 0.2; // the higher this value, the less the spherical the movement is
      const rho = this.width / 2 * (blend + (1 - blend) / 2 * Math.cos(2 * time_theta));
      const x = rho * Math.cos(time_theta) + this._center.x;
      const y = rho * Math.sin(time_theta) + this._center.y;

      this._eyes.forEach(e => e.move(x, y));
    }

    this.ctx.save();
    // clear background
    this.ctx.fillStyle = "rgb(240, 240, 240)";
    this.ctx.fillRect(0, 0, this.width, this.height);
    // apply image on top
    this.ctx.drawImage(this._image, this._dx, this._dy, this._dest_width, this._dest_height);
    // show eyes
    this._eyes.forEach(e => e.show(this.ctx));
    this.ctx.restore();

    // record
    if (this._recording) {
      if (this.frameCount < this._duration) {
        this._capturer.capture(this._canvas);
      } else {
        this._recording = false;
        this._capturer.stop();
        this._capturer.save();
        console.log("%c Recording ended", "color: red; font-size: 1rem");
      }
    }
  }

  mousemove(e) {
    // return if image is not loaded yet
    if (!this._loaded || this._auto) return;
    // update eyesight position
    const coords = this.calculate_press_coords(e);
    this._eyes.forEach(e => e.move(coords.x, coords.y));
  }

  click(e) {
    this._next_painting();
  }

  _next_painting() {
    // cycle throught paintings
    this._current_painting = (this._current_painting + 1) % this._paintings.length;
    this.setup();
  }

  _loadImage(path) {
    // return a promise to open the provided image
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = path;
      img.onload = () => resolve(img);
      img.fail = () => reject("error");
    });
  }
}

const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

const shuffle_array = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

const random = (a, b) => {
  if (a == undefined && b == undefined) return random(0, 1);
  else if (b == undefined) return random(0, a);
  else if (a != undefined && b != undefined) return Math.random() * (b - a) + a;
};

const distSq = (x1, y1, x2, y2) => {
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
};

const dist = (x1, y1, x2, y2) => {
  return Math.sqrt(distSq(x1, y1, x2, y2));
};