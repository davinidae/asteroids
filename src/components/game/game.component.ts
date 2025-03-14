import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Game } from './other/game';

@Component({
  selector: 'game',
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D | null;

  title = 'game';
  game: Game | undefined;

  ngAfterViewInit() {
    console.log('GameComponent initialized');
    if (this.canvas) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.game = new Game(this.canvas.nativeElement, this.ctx!);
    }
  }

  ngOnDestroy() {
    clearTimeout(this.game?.interval);
  }
}
