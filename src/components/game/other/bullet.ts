import { Constants } from '../../../constants/game-constants';
import { Ship } from './ship';

export class Bullet {
  x = 0;
  y = 0;
  xv = 0;
  yv = 0;
  dist = 0;
  explodeTime = 0;

  constructor(private readonly ship: Ship) {
    // from the nose of the ship
    this.x = this.ship.x + (4 / 3) * this.ship.r * Math.cos(this.ship.a);
    this.y = this.ship.y - (4 / 3) * this.ship.r * Math.sin(this.ship.a);
    this.xv = (Constants.LASER_SPD * Math.cos(this.ship.a)) / Constants.FPS;
    this.yv = (-Constants.LASER_SPD * Math.sin(this.ship.a)) / Constants.FPS;
    this.dist = 0;
    this.explodeTime = 0;
  }
}
