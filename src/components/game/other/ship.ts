import { Constants } from '../../../constants/game-constants';
import { Laser } from './laser';
import { MusicLibrary } from './musicLibrary';

export class Ship {
  x = 0;
  y = 0;
  a = 0;
  r = 0;
  blinkNum = 0;
  blinkTime = 0;
  canShoot = false;
  dead = false;
  explodeTime = 0;
  rot = 0;
  thrusting = false;
  thrust = {
    x: 0,
    y: 0,
  };
  laser;

  explode() {
    this.explodeTime = Math.ceil(Constants.SHIP_EXPLODE_DUR * Constants.FPS);
    this.musicLibrary.fxExplode.play();
  }

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
    private readonly musicLibrary: MusicLibrary
  ) {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.a = (90 / 180) * Math.PI; // convert to radians
    this.r = Constants.SHIP_SIZE / 2;
    this.blinkNum = Math.ceil(Constants.SHIP_INV_DUR / Constants.SHIP_BLINK_DUR);
    this.blinkTime = Math.ceil(Constants.SHIP_BLINK_DUR * Constants.FPS);
    this.canShoot = true;
    this.dead = false;
    this.explodeTime = 0;
    this.rot = 0;
    this.thrusting = false;
    this.thrust = {
      x: 0,
      y: 0,
    };
    this.laser = new Laser(this.canvas, this.ctx, this.musicLibrary, this);
  }

  drawBody(x: number, y: number, a: number, colour = 'white') {
    this.ctx.strokeStyle = colour;
    this.ctx.lineWidth = Constants.SHIP_SIZE / 20;
    this.ctx.beginPath();
    this.ctx.moveTo(
      // nose of the ship
      x + (4 / 3) * this.r * Math.cos(a),
      y - (4 / 3) * this.r * Math.sin(a)
    );
    this.ctx.lineTo(
      // rear left
      x - this.r * ((2 / 3) * Math.cos(a) + Math.sin(a)),
      y + this.r * ((2 / 3) * Math.sin(a) - Math.cos(a))
    );
    this.ctx.lineTo(
      // rear right
      x - this.r * ((2 / 3) * Math.cos(a) - Math.sin(a)),
      y + this.r * ((2 / 3) * Math.sin(a) + Math.cos(a))
    );
    this.ctx.closePath();
    this.ctx.stroke();
  }

  drawThruster(blinkOn: boolean, exploding: boolean) {
    if (this.thrusting && !this.dead) {
      this.thrust.x += (Constants.SHIP_THRUST * Math.cos(this.a)) / Constants.FPS;
      this.thrust.y -= (Constants.SHIP_THRUST * Math.sin(this.a)) / Constants.FPS;
      this.musicLibrary.fxThrust.play();
      // draw the thruster
      if (!exploding && blinkOn) {
        this.ctx.fillStyle = 'red';
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = Constants.SHIP_SIZE / 10;
        this.ctx.beginPath();
        this.ctx.moveTo(
          // rear left
          this.x - this.r * ((2 / 3) * Math.cos(this.a) + 0.5 * Math.sin(this.a)),
          this.y + this.r * ((2 / 3) * Math.sin(this.a) - 0.5 * Math.cos(this.a))
        );
        this.ctx.lineTo(
          // rear centre (behind the ship)
          this.x - ((this.r * 5) / 3) * Math.cos(this.a),
          this.y + ((this.r * 5) / 3) * Math.sin(this.a)
        );
        this.ctx.lineTo(
          // rear right
          this.x - this.r * ((2 / 3) * Math.cos(this.a) - 0.5 * Math.sin(this.a)),
          this.y + this.r * ((2 / 3) * Math.sin(this.a) + 0.5 * Math.cos(this.a))
        );
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      }
      return;
    }
    // apply friction (slow ship down when not thrusting)
    this.thrust.x -= (Constants.FRICTION * this.thrust.x) / Constants.FPS;
    this.thrust.y -= (Constants.FRICTION * this.thrust.y) / Constants.FPS;
    this.musicLibrary.fxThrust.stop();
  }

  draw(blinkOn: boolean, exploding: boolean) {
    if (!exploding) {
      if (blinkOn && !this.dead) {
        this.drawBody(this.x, this.y, this.a);
      }
      // handle blinking
      if (this.blinkNum > 0) {
        // reduce the blink time
        this.blinkTime -= 1;
        // reduce the blink num
        if (this.blinkTime === 0) {
          this.blinkTime = Math.ceil(Constants.SHIP_BLINK_DUR * Constants.FPS);
          this.blinkNum -= 1;
        }
      }
      return;
    }
    // draw the explosion (concentric circles of different colours)
    this.ctx.fillStyle = 'darkred';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r * 1.7, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r * 1.4, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.fillStyle = 'orange';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r * 1.1, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.fillStyle = 'yellow';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r * 0.8, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r * 0.5, 0, Math.PI * 2, false);
    this.ctx.fill();
  }

  drawCollisionCircle() {
    if (!Constants.SHOW_BOUNDING) {
      return;
    }
    this.ctx.strokeStyle = 'lime';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    this.ctx.stroke();
  }

  drawCenterDot() {
    if (!Constants.SHOW_CENTRE_DOT) {
      return;
    }
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.x - 1, this.y - 1, 2, 2);
  }

  handleEdgeOfScreen() {
    if (this.x < 0 - this.r) {
      this.x = this.canvas.width + this.r;
    } else if (this.x > this.canvas.width + this.r) {
      this.x = 0 - this.r;
    }
    if (this.y < 0 - this.r) {
      this.y = this.canvas.height + this.r;
    } else if (this.y > this.canvas.height + this.r) {
      this.y = 0 - this.r;
    }
  }
}
