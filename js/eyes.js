class Eye {
  constructor(x, y, r) {
    // rounding for better performances
    this._x = Math.floor(x);
    this._y = Math.floor(y);
    this._r = Math.floor(r);
    // iris radius and distance from center
    this._iris_distance = Math.floor(0.4 * this._r);
    this._iris_radius = Math.floor(this._r - this._iris_distance);
    // eye rotation
    this._theta = 0;
    // colors
    this._white = "rgb(250, 250, 250)";
    this._black = "rgb(15, 15, 15)";
  }

  show(ctx) {
    ctx.save();
    ctx.translate(this._x, this._y);

    // outer part
    ctx.fillStyle = this._white;
    ctx.strokeStyle = this._black;
    ctx.lineWidth = 6 / 100 * this._r;

    ctx.beginPath();
    ctx.arc(0, 0, this._r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.rotate(this._theta);
    ctx.translate(this._iris_distance, 0);

    // inner part
    ctx.fillStyle = this._black;
    ctx.beginPath();
    ctx.arc(0, 0, this._iris_radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  move(x, y) {
    // calculate angle between eye and mouse coords
    this._theta = Math.atan2(y - this._y, x - this._x);
  }
}