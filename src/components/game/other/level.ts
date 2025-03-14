import { Utils } from '../../../utils';
import { Constants } from '../../../constants/game-constants';
import { Ship } from './ship';
import { Asteroids } from './asteroids';
import { MusicLibrary } from './musicLibrary';
import { Game } from './game';

export class Level {
  asteroids;
  ship;
  stage = -1;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
    private readonly musicLibrary: MusicLibrary,
    private readonly game: Game,
    private readonly previousLevel?: Level
  ) {
    this.game = game;
    this.ship = new Ship(this.canvas, this.ctx, this.musicLibrary);
    this.asteroids = new Asteroids(this.canvas, this.ctx, this.musicLibrary, this.ship, this, this.game);
  }

  detectLaserHitsAsteroids() {
    for (let i = this.asteroids.belt.length - 1; i >= 0; i -= 1) {
      // grab the asteroid properties
      const asteroidX = this.asteroids.belt[i].x;
      const asteroidY = this.asteroids.belt[i].y;
      const asteroidR = this.asteroids.belt[i].r;
      // loop over the laser
      for (let j = this.ship.laser.bullets.length - 1; j >= 0; j -= 1) {
        // grab the laser properties
        const laserX = this.ship.laser.bullets[j].x;
        const laserY = this.ship.laser.bullets[j].y;
        // detect hits
        if (this.ship.laser.bullets[j]?.explodeTime === 0 && Utils.Number.distBetweenPoints(asteroidX, asteroidY, laserX, laserY) < asteroidR) {
          // destroy the asteroid and activate the laser explosion
          this.ship.laser.bullets[j].explodeTime = Math.ceil(Constants.LASER_EXPLODE_DUR * Constants.FPS);
          this.asteroids.destroy(i);
          break;
        }
      }
    }
  }

  checkShipCollidesAsteroids(exploding: boolean) {
    if (!exploding) {
      // only check when not blinking
      if (this.ship.blinkNum === 0 && !this.ship.dead) {
        for (let i = 0; i < this.asteroids.belt.length; i += 1) {
          if (
            Utils.Number.distBetweenPoints(this.ship.x, this.ship.y, this.asteroids.belt[i].x, this.asteroids.belt[i].y) <
            this.ship.r + this.asteroids.belt[i].r
          ) {
            this.ship.explode();
            this.asteroids.destroy(i);
            break;
          }
        }
      }
      // rotate the ship
      this.ship.a += this.ship.rot;
      // move the ship
      this.ship.x += this.ship.thrust.x;
      this.ship.y += this.ship.thrust.y;
      return;
    }
    // reduce the explode time
    this.ship.explodeTime -= 1;
    // reset the ship after the explosion has finished
    if (this.ship?.explodeTime === 0) {
      this.game.lives -= 1;
      if (this.game.lives === 0) {
        this.game.gameOver();
        return;
      }
      this.ship = new Ship(this.canvas, this.ctx, this.musicLibrary);
    }
  }

  nextStage() {
    this.game.lives = Constants.GAME_LIVES;
    this.game.level.ship = new Ship(this.canvas, this.ctx, this.musicLibrary);
    // get the high score from local storage
    let scoreStr = localStorage.getItem(Constants.SAVE_KEY_SCORE);
    const scoreLadder: number[] = scoreStr == null || !scoreStr.includes('[') ? [] : JSON.parse(scoreStr);
    this.game.scoreLadder = scoreLadder.sort((a, b) => b - a);
    this.game.scoreHigh = [this.game.score, ...scoreLadder].reduce((acc, o) => {
      return Math.max(acc, o);
    }, 0);
    this.musicLibrary.background.setAsteroidRatio(1);
    const stage = this.previousLevel != null ? this.previousLevel.stage : this.stage;
    this.stage = stage + 1;
    this.game.text = 'Level ' + (this.stage + 1);
    this.game.textAlpha = 1.0;
    this.asteroids = new Asteroids(this.canvas, this.ctx, this.musicLibrary, this.ship, this, this.game);
  }

  draw() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
