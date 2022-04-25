import { Injectable } from '@angular/core';
import { Chess, ChessInstance } from 'chess.js';

@Injectable()
export class GameboardService {

  private readonly chess: ChessInstance;
  constructor() {
    this.chess = Chess()
  }

  public turn(pgn: string) {
    this.chess.load_pgn(pgn);
    return this.chess.turn();
  }
}
