import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { interval, Subscription } from 'rxjs';
import { MatchmakingService } from 'src/app/shared/matchmaking.service';
import { SocketService } from 'src/app/sockets/socket.service';
import { startGame } from 'src/app/state/actions/game-data.action';
import { AuthData } from 'src/app/state/models/auth-data.model';
import { GameData } from 'src/app/state/models/game-data.model';

@Component({
  selector: 'app-find-game-dialog',
  templateUrl: './find-game-dialog.component.html',
  styleUrls: ['./find-game-dialog.component.scss'],
})
export class FindGameDialogComponent implements OnInit, OnDestroy {
  foundGame$!: Subscription;
  searchForGame$!: Subscription;
  counter$!: Subscription;

  isSearchingGame: boolean;
  isLobbyCreated: boolean;
  timer: string = '00:00';
  seconds: number = 0;

  constructor(
    private socketService: SocketService,
    private matchmaking: MatchmakingService,
    private store: Store<{ auth: AuthData; game: GameData }>,
    private router: Router,
    private dialog: MatDialogRef<FindGameDialogComponent>,
  ) {
    this.isSearchingGame = false;
    this.isLobbyCreated = false;
  }

  ngOnInit(): void {
    this.foundGame$ = this.socketService.listen('found-game').subscribe({
      next: (data) => {
        this.setGameDataInLocalStorage(data.gameId, data.color);
        this.isLobbyCreated = false;
        this.store.dispatch(
          startGame({
            isGameGoing: true,
            gameId: data.gameId,
            color: data.color,
          })
        );
        // TODO: router navigate to chess component /dashboard/chess/:gameId
        this.router.navigate(['/dashboard/game']);
        this.dialog.close();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.onCancel();
    this.foundGame$.unsubscribe();
  }

  onFindGame(type: string) {
    console.log(type);

    this.searchForGame$ = this.matchmaking.findGame(type).subscribe({
      next: (data) => {
        if (!data.game) {
          this.isLobbyCreated = true;
        } else {
          console.log(data);
          // TODO: set gameId and color in local storage here
          this.setGameDataInLocalStorage(data.game.newPlayer.gameId, data.game.newPlayer.color);
          this.store.dispatch(
            startGame({
              isGameGoing: true,
              gameId: data.game.newPlayer.gameId,
              color: data.game.newPlayer.color,
            })
          );
          // TODO: router navigate to chess component /dashboard/chess/:gameId
          this.router.navigate(['/dashboard/game']);
          this.dialog.close();
        }
      },
      error: (error) => {
        console.error(error);
      },
    });

    this.counter$ = interval(1000).subscribe({
      next: (_value) => {
        this.seconds = this.seconds + 1;
        this.timer = new Date(this.seconds * 1000).toISOString().substr(14, 5);
      },
    });
    this.isSearchingGame = true;
  }

  onCancel(): void {
    if (this.counter$) {
      this.counter$.unsubscribe();
    }
    if (this.isLobbyCreated) {
      this.matchmaking.deleteLobby().then((value) => {
        console.log(value);
        this.isLobbyCreated = false;
      });
    }
    this.seconds = 0;
    this.timer = '00:00';
    this.isSearchingGame = false;
  }

  private setGameDataInLocalStorage(gameId: string, color: string) {
    localStorage.setItem('gameId', gameId);
    localStorage.setItem('color', color);
  }
}
