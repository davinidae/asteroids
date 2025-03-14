import { TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';

describe('GameComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent],
    }).compileComponents();
  });
});
