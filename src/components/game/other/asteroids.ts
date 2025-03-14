import { Constants } from '../../../constants/game-constants';
import { Utils } from '../../../utils';
import { Asteroid } from './asteroid';
import { MusicLibrary } from './musicLibrary';
import { Ship } from './ship';
import { Level } from './level';
import { Game } from './game';

export class Asteroids {
  total = 0;
  left = 0;
  belt: Asteroid[] = [];

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
    private readonly musicLibrary: MusicLibrary,
    private readonly ship: Ship,
    private readonly level: Level,
    private readonly game: Game
  ) {
    this.total = (Constants.ROID_NUM + this.level.stage) * 7;
    this.left = this.total;
    let x = Math.floor(Math.random() * this.canvas.width);
    let y = Math.floor(Math.random() * this.canvas.height);
    for (let i = 0; i < Constants.ROID_NUM + this.level.stage; i += 1) {
      // random asteroid location (not touching spaceship)
      while (Utils.Number.distBetweenPoints(this.ship.x, this.ship.y, x, y) < Constants.ROID_SIZE * 2 + this.ship.r) {
        x = Math.floor(Math.random() * this.canvas.width);
        y = Math.floor(Math.random() * this.canvas.height);
      }
      this.belt.push(new Asteroid(this.level, x, y, Math.ceil(Constants.ROID_SIZE / 2)));
    }
  }

  destroy(index: number) {
    let x = this.belt[index].x;
    let y = this.belt[index].y;
    let r = this.belt[index].r;
    // split the asteroid in two if necessary
    if (r === Math.ceil(Constants.ROID_SIZE / 2)) {
      // large asteroid
      this.belt.push(
        new Asteroid(this.level, x, y, Math.ceil(Constants.ROID_SIZE / 4)),
        new Asteroid(this.level, x, y, Math.ceil(Constants.ROID_SIZE / 4))
      );
      this.game.score += Constants.ROID_PTS_LGE;
    } else if (r === Math.ceil(Constants.ROID_SIZE / 4)) {
      // medium asteroid
      this.belt.push(
        new Asteroid(this.level, x, y, Math.ceil(Constants.ROID_SIZE / 8)),
        new Asteroid(this.level, x, y, Math.ceil(Constants.ROID_SIZE / 8))
      );
      this.game.score += Constants.ROID_PTS_MED;
    } else {
      this.game.score += Constants.ROID_PTS_SML;
    }
    // check high score
    if (this.game.score > this.game.scoreHigh) {
      this.game.scoreHigh = this.game.score;
    }
    // destroy the asteroid
    this.belt.splice(index, 1);
    this.musicLibrary.fxHit.play();
    // calculate the ratio of remaining asteroids to determine background music tempo
    this.left -= 1;
    this.musicLibrary.background.setAsteroidRatio(this.left / this.total);
    // new stage when no more asteroids
    if (this.belt.length > 0) {
      return;
    }
    this.level.nextStage();
  }

  move() {
    for (let i = 0; i < this.belt.length; i += 1) {
      this.belt[i].x += this.belt[i].xv;
      this.belt[i].y += this.belt[i].yv;
      // handle asteroid edge of screen
      if (this.belt[i].x < 0 - this.belt[i].r) {
        this.belt[i].x = this.canvas.width + this.belt[i].r;
      } else if (this.belt[i].x > this.canvas.width + this.belt[i].r) {
        this.belt[i].x = 0 - this.belt[i].r;
      }
      if (this.belt[i].y < 0 - this.belt[i].r) {
        this.belt[i].y = this.canvas.height + this.belt[i].r;
      } else if (this.belt[i].y > this.canvas.height + this.belt[i].r) {
        this.belt[i].y = 0 - this.belt[i].r;
      }
    }
  }

  draw() {
    for (let i = 0; i < this.belt.length; i += 1) {
      this.ctx.strokeStyle = 'slategrey';
      this.ctx.lineWidth = Constants.SHIP_SIZE / 20;
      // get the asteroid properties
      const { a, r, x, y, offs, vert } = this.belt[i];
      // draw the path
      this.ctx.beginPath();
      this.ctx.moveTo(x + r * offs[0] * Math.cos(a), y + r * offs[0] * Math.sin(a));
      // draw the polygon
      for (let j = 1; j < vert; j += 1) {
        this.ctx.lineTo(x + r * offs[j] * Math.cos(a + (j * Math.PI * 2) / vert), y + r * offs[j] * Math.sin(a + (j * Math.PI * 2) / vert));
      }
      this.ctx.closePath();
      this.ctx.stroke();
      // show asteroid's collision circle
      if (!Constants.SHOW_BOUNDING) {
        continue;
      }
      this.ctx.strokeStyle = 'lime';
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
      this.ctx.stroke();
    }
  }
}
