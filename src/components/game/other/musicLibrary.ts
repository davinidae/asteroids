import { Music } from './music';
import { Sound } from './sound';

export class MusicLibrary {
  fxExplode: Sound;
  fxHit: Sound;
  fxLaser: Sound;
  fxThrust: Sound;
  background: Music;

  constructor() {
    this.fxExplode = new Sound('../../../sounds/explode.mp3');
    this.fxHit = new Sound('../../../sounds/hit.mp3', 5);
    this.fxLaser = new Sound('../../../sounds/laser.mp3', 5, 0.5);
    this.fxThrust = new Sound('../../../sounds/thrust.mp3');

    this.background = new Music('../../../sounds/music-low.mp3', '../../../sounds/music-high.mp3');
  }
}
