import { Constants } from '../../../constants/game-constants';

export class Sound {
  maxStreams = 0;
  streams: HTMLAudioElement[] = [];
  streamNum = 0;

  constructor(src: string, maxStreams = 1, vol = 1.0) {
    this.maxStreams = maxStreams;
    this.streamNum = 0;
    this.streams = [];
    for (let i = 0; i < maxStreams; i += 1) {
      const audio = new Audio(src);
      audio.volume = vol;
      audio.preload = 'auto';
      this.streams.push(audio);
    }
  }

  play() {
    if (Constants.SOUND_ON) {
      this.streamNum = (this.streamNum + 1) % this.maxStreams;
      this.streams[this.streamNum].play();
    }
  }

  stop() {
    this.streams[this.streamNum].pause();
    this.streams[this.streamNum].currentTime = 0;
  }
}
