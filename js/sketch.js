class Sketch extends Engine {
  preload() {

  }

  async setup() {
    this._loaded = false;

    this._image = await this._loadImage();
    this._image_ratio = Math.min(this.width, this.height) / Math.max(this._image.width, this._image.height);

    this._dest_width = this._image.width * this._image_ratio;
    this._dest_height = this._image.height * this._image_ratio;

    this._dx = (this.width - this._dest_width) / 2;
    this._dy = (this.height - this._dest_height) / 2;

    this._eyes = [
      new Eye(0.40375 * this._dest_width + this._dx, 0.23154 * this.height, 17),
      new Eye(0.505 * this._dest_width + this._dx, 0.2307 * this._dest_height + this._dy, 17),
    ];


    this._loaded = true;
  }

  draw() {
    if (!this._loaded) return;

    this.ctx.save();

    this.ctx.fillStyle = "rgb(240, 240, 240)";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this._image, this._dx, this._dy, this._dest_width, this._dest_height);

    this._eyes.forEach(e => e.show(this.ctx));
    this.ctx.restore();
  }

  mousemove(e) {
    const coords = this.calculate_press_coords(e);
    this._eyes.forEach(e => e.move(coords.x, coords.y));
  }

  _loadImage() {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = "js/paintings/mona-lisa.jpg";
      img.onload = () => resolve(img);
      img.fail = () => reject("error");
    });
  }
}