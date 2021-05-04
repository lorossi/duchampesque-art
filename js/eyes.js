class Eye {
  constructor(x, y, r) {
    this._x = Math.floor(x);
    this._y = Math.floor(y);
    this._r = Math.floor(r);

    this._iris_distance = Math.floor(0.4 * this._r);
    this._iris_radius = Math.floor(this._r - this._iris_distance);

    this._theta = 0;
  }

  show(ctx) {
    ctx.save();
    ctx.translate(this._x, this._y);

    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.strokeStyle = "rgb(15, 15, 15)";
    ctx.lineWidth = 6 / 100 * this._r;

    ctx.beginPath();
    ctx.arc(0, 0, this._r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.rotate(this._theta);
    ctx.translate(this._iris_distance, 0);

    ctx.fillStyle = "rgb(15, 15, 15)";
    ctx.beginPath();
    ctx.arc(0, 0, this._iris_radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  move(x, y) {
    this._theta = Math.atan2(y - this._y, x - this._x);
  }
}