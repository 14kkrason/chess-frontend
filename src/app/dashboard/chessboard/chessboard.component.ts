import { ContentObserver } from '@angular/cdk/observers';
import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxChessBoardView } from 'ngx-chess-board';
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import { Subscription } from 'rxjs';
import { GameboardService } from 'src/app/shared/gameboard.service';
import { SocketService } from 'src/app/sockets/socket.service';
import { endGame } from 'src/app/state/actions/game-data.action';
import { AuthData } from 'src/app/state/models/auth-data.model';
import { GameData } from 'src/app/state/models/game-data.model';
import { DrawOfferDialogComponent } from './draw-offer-dialog/draw-offer-dialog.component';
import { GameInformationDialogComponent } from './game-information-dialog/game-information-dialog.component';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChessboardComponent
  implements OnInit, AfterContentChecked, OnDestroy, AfterViewInit
{
  @ViewChild('board', { static: false }) board!: NgxChessBoardView;

  @ViewChild('oponentCountdown', { static: false })
  oponentCountdown!: CountdownComponent;

  @ViewChild('playerCountdown', { static: false })
  playerCountdown!: CountdownComponent;

  public authData$!: Subscription;
  public authData!: AuthData;

  public gameData$!: Subscription;
  public gameData!: GameData;

  public lightDisabled = true;
  public darkDisabled = true;

  // countdowns
  public playerCountdownConfig: CountdownConfig = {};
  public oponentCountdownConfig: CountdownConfig = {};

  // data used on displaying
  public playerUsername = 'Player';
  public oponentUsername = 'Oponent';

  private socketListeners$: Subscription[] = [];

  private isGameAlreadySetUp = false;

  constructor(
    private readonly cdref: ChangeDetectorRef,
    private readonly store: Store<{ auth: AuthData; game: GameData }>,
    private readonly socketService: SocketService,
    private readonly gameboardService: GameboardService,
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  // TODO: setup countdown, user data, etc
  // how we do that?
  // on component init:
  // 1. Request game data -> what the timers are, game PGN, user data and IF the game is going.
  // 1.5 If the game is not going -> set the player status as ready and proceed (backend) -> the response should reflect this
  // 2. On no game, display that game ended or that no is being played ATM
  // 3. On game:
  // - update game PGN
  // - update timers
  // - start timer of a player whose turn it is
  ngOnInit(): void {
    this.gameData$ = this.store.select('game').subscribe({
      next: (game: GameData) => {
        // we get data only on first init of the component
        if(!this.isGameAlreadySetUp) {
          this.gameData = game;
        }
      },
      error: (error) => {
        console.error(error.message);
      },
    });

    this.authData$ = this.store.select('auth').subscribe({
      next: (auth: AuthData) => {
        this.authData = auth;
      },
      error: (error) => {
        console.error(error.message);
      },
    });
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  ngOnDestroy(): void {
    this.socketListeners$.forEach((subsciption) => subsciption.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.setupGameListeners();
    this.startGame();
  }

  private startGame(): void {
    this.http
      .post<any>(
        'http://localhost:3000/api/game-management/ongoing-game-data',
        {
          gameId: this.gameData.gameId,
          color: this.gameData.color,
        },
        {
          withCredentials: true,
          responseType: 'json',
        }
      )
      .subscribe({
        next: (data) => {
          // on no match we display that the user is stupidW
          switch (data.status) {
            case 'game-is-ready':
              // we do nothing, this probably aready happened
              break;
            case 'game-not-ready':
              // we do nothing, waiting is best
              break;
            case 'game-ended':
              // TODO: begin teardown and disaplyInformation that there is no game and the user should go home
              break;
            default:
              // this should never happen
              break;
          }
        },
      });
  }

  private startTimer(pgn: string, color: string): void {
    if (this.gameboardService.turn(pgn) === color) {
      // post request - get your timer and start it
      this.http
        .post<any>(
          'http://localhost:3000/api/game-management/timer',
          {
            gameId: this.gameData.gameId,
            color: this.gameData.color,
          },
          {
            withCredentials: true,
            responseType: 'json',
          }
        )
        .subscribe({
          next: (data) => {
            if (data.leftTime) {
              this.playerCountdownConfig = {
                format: 'mm:ss',
                leftTime: parseInt(data.leftTime),
                demand: true,
              }; // data.leftTime;
              this.enableBoard(color);
              setTimeout(() => this.playerCountdown.begin(), 10);
            } else {
              // TODO: in this case timers don't exist, begin teardown.
            }
          },
        });
    } else {
      // we do this so all config can be set up properly
      setTimeout(() => this.oponentCountdown.begin(), 10);
    }
  }

  private setupGameListeners(): void {
    // this method sets up listeners for websocket events, this will be the primary mote of communication during games
    this.socketListeners$.push(
      this.socketService.listen('game-is-ready').subscribe({
        next: (data) => {
          if (!this.isGameAlreadySetUp) {
            this.board.setPGN(data.pgn);
            if (this.gameData.color === 'black') {
              this.board.reverse();
            }
            this.setupPlayersData(data);
            this.startTimer(data.pgn, data.color);
            setTimeout(() => (this.isGameAlreadySetUp = true), 10);
          }
        },
        error: (error) => {
          console.error(error);
        },
      }),
      this.socketService.listen('move-made-successfully').subscribe({
        next: (data) => {
          if (data.color === this.gameData.color) {
            this.playerCountdown.pause();
            this.playerCountdownConfig = {
              format: 'mm:ss',
              leftTime: parseInt(data.timeLeft),
              demand: true,
            };
            this.disableBoard(this.gameData.color!);
          } else {
            this.oponentCountdown.pause();
            this.oponentCountdownConfig = {
              format: 'mm:ss',
              leftTime: parseInt(data.timeLeft),
              demand: true,
            };
            this.board.move(data.move);
          }
        },
        error: (error) => {
          console.error(error);
        },
      }),
      this.socketService.listen('started-timer').subscribe({
        next: (data) => {
          if (data.color === this.gameData.color) {
            // our timer was started with these values left, we start it again
            this.playerCountdownConfig = {
              format: 'mm:ss',
              leftTime: parseInt(data.timeLeft),
              demand: true,
            };
            this.enableBoard(this.gameData.color!);
            setTimeout(() => this.playerCountdown.resume(), 10);
          } else {
            this.oponentCountdownConfig = {
              format: 'mm:ss',
              leftTime: parseInt(data.timeLeft),
              demand: true,
            };
            setTimeout(() => this.oponentCountdown.resume(), 10);
          }
        },
        error: (error) => {},
      }),
      this.socketService.listen('checkmate').subscribe({
        next: (data) => {
          this.oponentCountdown.pause();
          this.playerCountdown.pause();
          this.store.dispatch(endGame());
          this.dialog
            .open(GameInformationDialogComponent, {
              height: '40%',
              width: '30%',
              data: {
                gameData: {
                  ...this.gameData,
                },
                recievedData: {
                  ...data,
                },
              },
            })
            .afterClosed()
            .subscribe({
              next: (_) => {
                this.router.navigate(['/dashboard']);
              },
            });
        },
        error: (error) => {},
      }),
      this.socketService.listen('agreed_draw').subscribe({
        next: (data) => {
          this.oponentCountdown.pause();
          this.playerCountdown.pause();
          this.store.dispatch(endGame());
          this.dialog
            .open(GameInformationDialogComponent, {
              height: '40%',
              width: '30%',
              data: {
                gameData: {
                  ...this.gameData,
                },
                recievedData: {
                  ...data,
                },
              },
            })
            .afterClosed()
            .subscribe({
              next: (_) => {
                this.router.navigate(['/dashboard']);
              },
            });
        },
        error: (error) => {},
      }),
      this.socketService.listen('stalemate').subscribe({
        next: (data) => {
          this.oponentCountdown.pause();
          this.playerCountdown.pause();
          this.store.dispatch(endGame());
          this.dialog
            .open(GameInformationDialogComponent, {
              height: '40%',
              width: '30%',
              data: {
                gameData: {
                  ...this.gameData,
                },
                recievedData: {
                  ...data,
                },
              },
            })
            .afterClosed()
            .subscribe({
              next: (_) => {
                this.router.navigate(['/dashboard']);
              },
            });
        },
        error: (error) => {},
      }),
      this.socketService.listen('threefold_repetition').subscribe({
        next: (data) => {
          this.oponentCountdown.pause();
          this.playerCountdown.pause();
          this.store.dispatch(endGame());
          this.dialog
            .open(GameInformationDialogComponent, {
              height: '40%',
              width: '30%',
              data: {
                gameData: {
                  ...this.gameData,
                },
                recievedData: {
                  ...data,
                },
              },
            })
            .afterClosed()
            .subscribe({
              next: (_) => {
                this.router.navigate(['/dashboard']);
              },
            });
        },
        error: (error) => {},
      }),
      this.socketService.listen('draw-offered').subscribe({
        next: (data) => {
          // TODO: implement draw-offer logic
          this.dialog
            .open(DrawOfferDialogComponent, {
              height: '40%',
              width: '30%',
              disableClose: true,
              data: {
                gameData: {
                  ...this.gameData,
                },
              },
            })
            .afterClosed()
            .subscribe({
              next: (data) => {
                switch (data) {
                  case 'accepted':
                    this.socketService.emit('accept-draw', {
                      ...this.gameData,
                    });
                    break;
                  case 'declined':
                    this.socketService.emit('decline-draw', {
                      ...this.gameData,
                    });
                    break;
                }
              },
            });
        },
        error: (error) => {},
      }),
      this.socketService.listen('player-resigned').subscribe({
        next: (data) => {
          this.oponentCountdown.pause();
          this.playerCountdown.pause();
          this.store.dispatch(endGame());
          this.dialog
            .open(GameInformationDialogComponent, {
              height: '40%',
              width: '30%',
              data: {
                gameData: {
                  ...this.gameData,
                },
                recievedData: {
                  ...data,
                },
              },
            })
            .afterClosed()
            .subscribe({
              next: (_) => {
                this.router.navigate(['/dashboard']);
              },
            });
        },
        error: (error) => {},
      }),
      this.socketService.listen('timeout').subscribe({
        next: (data) => {
          this.oponentCountdown.pause();
          this.playerCountdown.pause();
          this.store.dispatch(endGame());
          this.dialog
            .open(GameInformationDialogComponent, {
              height: '40%',
              width: '30%',
              data: {
                gameData: {
                  ...this.gameData,
                },
                recievedData: {
                  ...data,
                },
              },
            })
            .afterClosed()
            .subscribe({
              next: (_) => {
                this.router.navigate(['/dashboard']);
              },
            });
        },
        error: (error) => {},
      })
    );
  }

  private setupPlayersData(data: any): void {
    if (data.color === 'w') {
      this.playerUsername = data.white;
      this.oponentUsername = data.black;
      this.playerCountdownConfig = {
        format: 'mm:ss',
        leftTime: parseInt(data.whiteTimer),
        demand: true,
      };
      this.oponentCountdownConfig = {
        format: 'mm:ss',
        leftTime: parseInt(data.blackTimer),
        demand: true,
      };
    } else if (data.color === 'b') {
      this.playerUsername = data.black;
      this.oponentUsername = data.white;
      this.playerCountdownConfig = {
        format: 'mm:ss',
        leftTime: parseInt(data.blackTimer),
        demand: true,
      };
      this.oponentCountdownConfig = {
        format: 'mm:ss',
        leftTime: parseInt(data.whiteTimer),
        demand: true,
      };
    }
  }

  private enableBoard(color: string): void {
    if (color === 'w' || color === 'white') {
      this.lightDisabled = false;
    } else if (color === 'b' || color === 'black') {
      this.darkDisabled = false;
    }
  }

  private disableBoard(color: string): void {
    if (color === 'w' || color === 'white') {
      this.lightDisabled = true;
    } else if (color === 'b' || color === 'black') {
      this.darkDisabled = true;
    }
  }

  private teardown(): void {}

  public onMadeMove(event: any): void {
    // we send move if and only if the game is set up,
    // that way we don't suffer from  consquences when players
    // use this.board.setPgn(...) after game reboot
    if (event.color === this.gameData.color && this.isGameAlreadySetUp) {
      const gameId = this.gameData.gameId;
      this.socketService.emit('move-made', { ...event, gameId });
    }

    // do local things with the score:
    // - display messages
    // move object
    /*  check: false;
    checkmate: false;
    color: 'white';
    fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
    freeMode: false;
    mate: false;
    move: 'e2e4';
    pgn: {
      pgn: '1. e4';
    }
    piece: 'Pawn';
    stalemate: false;
    x: false; */

    /*  {
      "color": "black",
      "status": "win",
      "reason": "checkmate",
      "result": {
          "nWhiteRating": 780,
          "nBlackRating": 820,
          "gainWhite": -20,
          "gainBlack": 20
      }
  } */
  }

  onResign(): void {
    this.socketService.emit('resign', { ...this.gameData });
  }

  onOfferDraw(): void {
    this.socketService.emit('offer-draw', { ...this.gameData });
  }
}
