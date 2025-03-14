import { Constants } from '../../../constants/game-constants';
import { Bullet } from './bullet';
import { MusicLibrary } from './musicLibrary';
import { Ship } from './ship';

export class Laser {
  canShoot = true;
  bullets: Bullet[] = [];

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
    private readonly musicLibrary: MusicLibrary,
    private readonly ship: Ship
  ) {
    //
  }

  shoot() {
    if (this.canShoot && this.bullets.length < Constants.LASER_MAX) {
      this.bullets.push(new Bullet(this.ship));
      this.musicLibrary.fxLaser.play();
    }
    // prevent further shooting
    this.canShoot = false;
  }

  draw() {
    for (let i = 0; i < this.bullets.length; i += 1) {
      if (this.bullets[i]?.explodeTime === 0) {
        this.ctx.fillStyle = 'salmon';
        this.ctx.beginPath();
        this.ctx.arc(this.bullets[i].x, this.bullets[i].y, Constants.SHIP_SIZE / 15, 0, Math.PI * 2, false);
        this.ctx.fill();
        continue;
      }
      // draw the eplosion
      this.ctx.fillStyle = 'orangered';
      this.ctx.beginPath();
      this.ctx.arc(this.bullets[i].x, this.bullets[i].y, this.ship.r * 0.75, 0, Math.PI * 2, false);
      this.ctx.fill();
      this.ctx.fillStyle = 'salmon';
      this.ctx.beginPath();
      this.ctx.arc(this.bullets[i].x, this.bullets[i].y, this.ship.r * 0.5, 0, Math.PI * 2, false);
      this.ctx.fill();
      this.ctx.fillStyle = 'pink';
      this.ctx.beginPath();
      this.ctx.arc(this.bullets[i].x, this.bullets[i].y, this.ship.r * 0.25, 0, Math.PI * 2, false);
      this.ctx.fill();
    }
  }

  move() {
    for (let i = this.bullets.length - 1; i >= 0; i -= 1) {
      // check distance travelled
      if (this.bullets[i].dist > Constants.LASER_DIST * this.canvas.width) {
        this.bullets.splice(i, 1);
        continue;
      }
      // handle the explosion
      if (this.bullets[i]?.explodeTime > 0) {
        this.bullets[i].explodeTime -= 1;
        // destroy the laser after the duration is up
        if (this.bullets[i]?.explodeTime === 0) {
          this.bullets.splice(i, 1);
          continue;
        }
      } else {
        // move the laser
        this.bullets[i].x += this.bullets[i].xv;
        this.bullets[i].y += this.bullets[i].yv;
        // calculate the distance travelled
        this.bullets[i].dist += Math.sqrt(Math.pow(this.bullets[i].xv, 2) + Math.pow(this.bullets[i].yv, 2));
      }
      // handle edge of screen
      if (this.bullets[i].x < 0) {
        this.bullets[i].x = this.canvas.width;
      } else if (this.bullets[i].x > this.canvas.width) {
        this.bullets[i].x = 0;
      }
      if (this.bullets[i].y < 0) {
        this.bullets[i].y = this.canvas.height;
      } else if (this.bullets[i].y > this.canvas.height) {
        this.bullets[i].y = 0;
      }
    }
  }
}
