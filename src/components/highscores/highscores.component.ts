import { Component, AfterViewInit } from '@angular/core';
import { Constants } from '../../constants/game-constants';

@Component({
  selector: 'highscores',
  imports: [],
  templateUrl: './highscores.component.html',
  styleUrl: './highscores.component.css',
})
export class HighscoresComponent implements AfterViewInit {
  title = 'highscores';
  highscores: {
    name: string;
    score: string;
  }[] = [];
  interval: ReturnType<typeof setInterval> | undefined;

  ngAfterViewInit() {
    this.retrieve();
    this.interval = setInterval(() => {
      this.retrieve();
    }, 1000);
  }

  retrieve() {
    let scores = JSON.parse(localStorage.getItem(Constants.SAVE_KEY_SCORE) || '[]') || [];
    if (!Array.isArray(scores)) {
      scores = [];
      localStorage.setItem(Constants.SAVE_KEY_SCORE, JSON.stringify(scores));
    }
    this.highscores = scores;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
