import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from '../game/game.component';
import { HighscoresComponent } from '../highscores/highscores.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameComponent, HighscoresComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'asteroids-angular';
}
