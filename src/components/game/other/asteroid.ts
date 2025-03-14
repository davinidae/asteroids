import { Constants } from '../../../constants/game-constants';
import { Level } from './level';

export class Asteroid {
  x = 0;
  y = 0;
  xv = 0;
  yv = 0;
  a = 0;
  r = 0;
  offs: number[] = [];
  vert = 0;

  constructor(
    private readonly level: Level,
    x: number,
    y: number,
    r: number
  ) {
    const lvlMult = 1 + 0.1 * this.level.stage;
    this.x = x;
    this.y = y;
    this.xv = ((Math.random() * Constants.ROID_SPD * lvlMult) / Constants.FPS) * (Math.random() < 0.5 ? 1 : -1);
    this.yv = ((Math.random() * Constants.ROID_SPD * lvlMult) / Constants.FPS) * (Math.random() < 0.5 ? 1 : -1);
    this.a = Math.random() * Math.PI * 2; // in radians
    this.r = r;
    this.offs = [];
    this.vert = Math.floor(Math.random() * (Constants.ROID_VERT + 1) + Constants.ROID_VERT / 2);
    // populate the offsets array
    for (let i = 0; i < this.vert; i += 1) {
      this.offs.push(Math.random() * Constants.ROID_JAG * 2 + 1 - Constants.ROID_JAG);
    }
  }
}
