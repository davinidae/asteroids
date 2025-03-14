import { Constants } from '../../../constants/game-constants';
import { MusicLibrary } from './musicLibrary';
import { Level } from './level';

export class Game {
  lives = Constants.GAME_LIVES;
  score = 0;
  scoreHigh = 0;
  musicLibrary;
  level;
  text = '';
  textAlpha = 0;
  paused = false;
  scoreLadder: number[] = [];
  interval: ReturnType<typeof setInterval>;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D
  ) {
    this.musicLibrary = new MusicLibrary();
    this.level = new Level(this.canvas, this.ctx, this.musicLibrary, this);
    this.reset();
    // set up event handlers
    document.addEventListener('keydown', e => {
      this.keyDown(e);
    });
    document.addEventListener('keyup', e => {
      this.keyUp(e);
    });
    // set up the game loop
    this.interval = setInterval(() => {
      this.update();
    }, 1000 / Constants.FPS);
    this.start();
  }

  start() {
    this.paused = false;
  }

  reset() {
    this.level.nextStage();
  }

  gameOver() {
    this.level.ship.dead = true;
    this.scoreLadder.push(this.score);
    const scoreLadder = this.scoreLadder.sort((a, b) => b - a);
    const ladder = scoreLadder.slice(0, Constants.SCORE_LADDER_SIZE);
    localStorage.setItem(Constants.SAVE_KEY_SCORE, JSON.stringify(ladder));
    this.pause();
  }

  keyDown(ev: KeyboardEvent) {
    if (this.level.ship.dead) {
      return;
    }
    if (this.paused) {
      return;
    }
    switch (ev.code) {
      case 'Space': {
        // shoot laser
        this.level.ship.laser.shoot();
        return;
      }
      case 'ArrowLeft': {
        // rotate ship left
        this.level.ship.rot = ((Constants.SHIP_TURN_SPD / 180) * Math.PI) / Constants.FPS;
        return;
      }
      case 'ArrowUp': {
        // thrust the ship forward
        this.level.ship.thrusting = true;
        return;
      }
      case 'ArrowRight': {
        // rotate ship right
        this.level.ship.rot = ((-Constants.SHIP_TURN_SPD / 180) * Math.PI) / Constants.FPS;
        return;
      }
      default: {
        return;
      }
    }
  }

  keyUp(ev: KeyboardEvent) {
    if (this.level.ship.dead) {
      return;
    }
    switch (ev.code) {
      case 'Escape': {
        if (this.paused) {
          this.start();
          return;
        }
        this.pause();
        return;
      }
      case 'Space': {
        // allow shooting again
        this.level.ship.laser.canShoot = true;
        return;
      }
      case 'ArrowLeft': {
        // stop rotating left
        this.level.ship.rot = 0;
        return;
      }
      case 'ArrowUp': {
        // stop thrusting
        this.level.ship.thrusting = false;
        return;
      }
      case 'ArrowRight': {
        // stop rotating right
        this.level.ship.rot = 0;
        return;
      }
    }
  }

  pause() {
    this.paused = true;
  }

  drawGameText() {
    if (this.level.ship.dead) {
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      this.ctx.font = 'small-caps ' + Constants.TEXT_SIZE + 'px dejavu sans mono';
      this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
      return;
    }
    if (this.paused) {
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      this.ctx.font = 'small-caps ' + Constants.TEXT_SIZE + 'px dejavu sans mono';
      this.ctx.fillText('PAUSE', this.canvas.width / 2, this.canvas.height / 2);
    }
    if (this.textAlpha >= 0) {
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillStyle = 'rgba(255, 255, 255, ' + this.textAlpha + ')';
      this.ctx.font = 'small-caps ' + Constants.TEXT_SIZE + 'px dejavu sans mono';
      this.ctx.fillText(this.text, this.canvas.width / 2, this.canvas.height * 0.75);
      this.textAlpha -= 1.0 / Constants.TEXT_FADE_TIME / Constants.FPS;
      return;
    }
  }

  drawLives(exploding: boolean) {
    for (let i = 0; i < this.lives; i += 1) {
      this.level.ship.drawBody(
        Constants.SHIP_SIZE + i * Constants.SHIP_SIZE * 1.2,
        Constants.SHIP_SIZE,
        0.5 * Math.PI,
        exploding && i === this.lives - 1 ? 'red' : 'white'
      );
    }
  }

  drawScore() {
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = 'white';
    this.ctx.font = Constants.TEXT_SIZE + 'px dejavu sans mono';
    this.ctx.fillText(this.score.toString(), this.canvas.width - Constants.SHIP_SIZE / 2, Constants.SHIP_SIZE);
  }

  drawHighScore() {
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = 'white';
    this.ctx.font = Constants.TEXT_SIZE * 0.75 + 'px dejavu sans mono';
    this.ctx.fillText('BEST ' + this.scoreHigh, this.canvas.width / 2, Constants.SHIP_SIZE);
  }

  draw(blinkOn: boolean, exploding: boolean) {
    this.level.draw();
    this.level.asteroids.draw();
    this.level.ship.draw(blinkOn, exploding);
    this.level.ship.drawThruster(blinkOn, exploding);
    this.level.ship.drawCollisionCircle();
    this.level.ship.drawCenterDot();
    this.level.ship.laser.draw();
    this.drawGameText();
    this.drawLives(exploding);
    this.drawScore();
    this.drawHighScore();
  }

  moveElements() {
    this.level.ship.laser.move();
    this.level.asteroids.move();
  }

  checkEvents(exploding: boolean) {
    this.level.detectLaserHitsAsteroids();
    this.level.checkShipCollidesAsteroids(exploding);
    this.level.ship.handleEdgeOfScreen();
  }

  update() {
    const blinkOn = this.paused ? true : this.level.ship.blinkNum % 2 === 0;
    const exploding = this.level.ship?.explodeTime > 0;
    this.draw(blinkOn, exploding);
    if (this.paused) {
      return;
    }
    this.musicLibrary.background.tick();
    this.checkEvents(exploding);
    this.moveElements();
  }
}
