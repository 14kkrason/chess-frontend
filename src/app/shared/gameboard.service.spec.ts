import { TestBed } from '@angular/core/testing';

import { GameboardService } from './gameboard.service';

describe('GameboardService', () => {
  let service: GameboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
