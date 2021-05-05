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
    this._current_painting = 0;
  }

  async setup() {
    // stop looping until the final image is loaded
    this._loaded = false;

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
    });

    this._loaded = true;
  }

  draw() {
    // wait until the image is loaded
    if (!this._loaded) return;

    this.ctx.save();
    // clear background
    this.ctx.fillStyle = "rgb(240, 240, 240)";
    this.ctx.fillRect(0, 0, this.width, this.height);
    // apply image on top
    this.ctx.drawImage(this._image, this._dx, this._dy, this._dest_width, this._dest_height);
    // show eyes
    this._eyes.forEach(e => e.show(this.ctx));
    this.ctx.restore();
  }

  mousemove(e) {
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

const shuffle_array = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};
