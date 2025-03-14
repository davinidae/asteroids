import { Constants } from '../../../constants/game-constants';

export class Music {
  soundLow: HTMLAudioElement;
  soundHigh: HTMLAudioElement;
  low: boolean;
  tempo: number;
  beatTime: number;

  constructor(srcLow: string, srcHigh: string) {
    this.soundLow = new Audio(srcLow);
    this.soundHigh = new Audio(srcHigh);
    this.low = true;
    this.tempo = 1.0; // seconds per beat
    this.beatTime = 0; // frames left until next beat
  }

  play() {
    if (!Constants.MUSIC_ON) {
      return;
    }
    if (this.low) {
      this.soundLow.play();
    } else {
      this.soundHigh.play();
    }
    this.low = !this.low;
  }

  setAsteroidRatio(ratio: number) {
    this.tempo = 1.0 - 0.75 * (1.0 - ratio);
  }

  tick() {
    if (this.beatTime === 0) {
      this.play();
      this.beatTime = Math.ceil(this.tempo * Constants.FPS);
      return;
    }
    this.beatTime -= 1;
  }
}
