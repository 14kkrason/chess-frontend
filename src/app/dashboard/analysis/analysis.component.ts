import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Chess, ChessInstance, Move } from 'chess.js';
import { NgxChessBoardView } from 'ngx-chess-board';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AnalysisComponent implements OnInit, OnDestroy {
  params: Params;

  @ViewChild('board', { static: false }) board: NgxChessBoardView;
  color: ThemePalette = 'accent';
  evaluation: string = '0';
  evalValue: number = 50;
  value: string = '';
  fen: string = '';

  freemode = false;
  lastFen = '';
  lastMoveCount = 0;

  // we have not made a move, we are at the first one
  chess: ChessInstance = new Chess();
  moveCount = 0;
  moveHistory: Move[];
  isPgnValid: boolean = true;
  // we run stockfish from a worker
  stockfish = new Worker('/assets/workers/stockfish.js', { type: 'module' });

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute
  ) {
    this.stockfish.onerror = (event) => {
      console.log(event);
    };

    this.stockfish.onmessage = (event) => {
      let info = /^info .* score (\w+) (-{0,1}\d+)/gm;
      const data = event.data.matchAll(info);
      for (const match of data) {
        let type = match[1];
        let score = match[2];
        console.log(type, score);
        this.chess.turn() == 'w' ? (score = score * 1) : (score = score * -1);
        if (type == 'cp') {
          score = (score / 100).toFixed(2);
          this.evaluation = score;
          this.evalValue = 50 + score * 10;
        } else {
          // it's reversed cuz it's mate
          let mateScore;
          this.chess.turn() == 'w' ? (mateScore = score * -1) : (mateScore = score * 1);
          this.evaluation = (type + ' ' +score);
          this.evalValue = 50 + 50 * mateScore;
        }
      }
    };
  }

  // CENTIPAWNS - the score returned by stockfish
  // 1 centipawn - 1/100 value of a pawn
  // we will do our scale in value of
  async ngOnInit(): Promise<void> {
    this.stockfish.postMessage('uci');
    this.stockfish.postMessage('isready');
    this.stockfish.postMessage('setoption name UCI_AnalyseMode value true');
    this.stockfish.postMessage('ucinewgame');
    this.stockfish.postMessage('position startpos');
    this.stockfish.postMessage('go depth 15');

    this.params = await firstValueFrom(this.route.params);
    if (this.params['id']) {
      this.http
        .get<any>(
          `http://localhost:3000/api/match-management/get-single-match/?id=${this.params['id']}`,
          {
            withCredentials: true,
            responseType: 'json',
          }
        )
        .subscribe((data) => {
          this.value = data.pgn;
          this.chess.load_pgn(data.pgn);
          this.fen = this.chess.fen();
          this.moveHistory = this.chess.history({ verbose: true });
        });
    } else {
      this.value = '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 {giuoco piano} *';
      this.chess.load_pgn('1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 {giuoco piano} *');
      this.fen = this.chess.fen();
      this.moveHistory = this.chess.history({ verbose: true });
    }
    this.chess.reset();
  }

  ngOnDestroy(): void {
    // we get rid of this guy for now
    this.stockfish.terminate();
  }

  onChangePgn(event: any) {
    const isPgnValid = this.chess.load_pgn(event);
    if (isPgnValid && !this.freemode) {
      this.isPgnValid = isPgnValid;
      this.value = event;
      this.moveCount = 0;
      this.moveHistory = this.chess.history({ verbose: true });
      this.board.reset();
    } else if (!isPgnValid && event === '') {
      console.debug('Nothing is happening.');
    } else {
      this.isPgnValid = isPgnValid;
    }
  }

  onClickFwd() {
    if (this.moveCount < this.moveHistory.length) {
      // this mess is here because ngx-chess-board
      // is not that good with handling promotion notation
      // in this case it's notation is:
      // "b2a14" for promotion of pawn to Knight
      // thus if there IS a promotion value we assign an additional
      // number to the end to not ask the guy who is
      // analysing the game to choose (as it is chosen)
      let promotionNumber: Number | String = '';
      let promotionChar: String | undefined = '';
      if (this.moveHistory[this.moveCount].promotion) {
        promotionChar = this.moveHistory[this.moveCount].promotion;
        switch (this.moveHistory[this.moveCount].promotion) {
          case 'q':
            promotionNumber = 1;
            break;
          case 'r':
            promotionNumber = 2;
            break;
          case 'b':
            promotionNumber = 3;
            break;
          case 'n':
            promotionNumber = 4;
            break;
          default:
            // pass
            break;
        }
      }

      let move =
        this.moveHistory[this.moveCount].from +
        this.moveHistory[this.moveCount].to;

      this.board.move(move + promotionNumber);
      this.chess.move(this.moveHistory[this.moveCount]);
      this.moveCount = this.moveCount + 1;
    }
  }

  onClickBwd() {
    if (this.moveCount > 0 && !this.freemode) {
      console.log('Turn before undo:', this.chess.turn());
      this.board.undo();
      this.chess.undo();
      console.log('Turn after undo:', this.chess.turn());
      this.stockfish.postMessage(`position fen ${this.board.getFEN()}`);
      this.stockfish.postMessage(`go depth 15`);
      this.moveCount = this.moveCount - 1;
      console.log('Moved backwards.');
      this.fen = this.board.getFEN();
    }

    // when in freemode we allow taking back pieces
    if(this.freemode) {
      this.board.undo()
      this.stockfish.postMessage(`position fen ${this.board.getFEN()}`);
      this.stockfish.postMessage(`go depth 15`);
    }
  }

  onMove(event: any) {
    this.stockfish.postMessage(`position fen ${this.board.getFEN()}`);
    this.stockfish.postMessage(`go depth 15`);
    this.fen = this.board.getFEN();
  }

  onToggleFreemode() {
    if(!this.freemode) {
      // we are allowing freemode
      // so we pass, we dont really do nothing
    } else {
      // we disable freemode
      this.board.reset();
      this.moveCount = 0;
    }
  }
}
