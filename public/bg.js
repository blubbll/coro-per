class Virus {
  constructor(ctx, x, y, size) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.size = size;

    this.color = "#E91E63"; //"rgba(200, 50, 255, 1)";

    this.tetha = Math.random() * Math.PI * 2;
    this.phi = Math.acos(Math.random() * 2 - 1);
  }

  update() {
    this.angleY = Math.sin(this.phi) * Math.sin(this.tetha) * 2;
    this.angleX = Math.sin(this.phi) * Math.cos(this.tetha) * 5;

    this.angle =
      -Math.sin(
        this.tetha + Math.sin(this.tetha + Math.sin(this.tetha) * 0.5)
      ) * 0.5;

    this.y += this.angle + this.angleY;
    this.x += this.angle + this.angleX;

    this.tetha += 0.05;

    this.render();
  }

  render() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.rect(this.x, this.y, this.size, this.size);
    this.ctx.fill();
    this.ctx.closePath();
  }
}

class Ctx2D {
  constructor(canvas, particles) {
    this.canvas = document.querySelector(canvas);
    this.ctx = this.canvas.getContext("2d");

    this.particles = particles;

    this.update = this.update.bind(this);
  }

  init() {
    this.objs = [];

    this.setValuesSize();

    const rad = 360 / this.particles;
    for (let i = 0; i < this.particles; i++) {
      const x = Math.cos(i * rad) * this.radius + innerWidth / 2;
      const y = Math.sin(i * rad) * this.radius + innerHeight / 2;
      const obj = new Virus(this.ctx, x, y, this.size);
      this.objs.push(obj);
    }
  }

  onResize() {
    window.addEventListener("resize", () => {
      this.setValuesSize();
      this.init();
    });
  }

  setValuesSize() {
    const styles = getComputedStyle(this.canvas);
    const w = +styles.width.split("px")[0];
    const h = +styles.height.split("px")[0];

    this.canvas.width = w;
    this.canvas.height = h;

    this.radius = w / 10;
    this.radius = h / 10;

    this.size = Math.max(Math.min(w, h) / (Math.random() + 40), 12);
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.objs.forEach(obj => {
      obj.update();
    });

    window.requestAnimationFrame(this.update);
  }
}

const cross = new Ctx2D("canvas", 200);

cross.init();
cross.onResize();
cross.update();
