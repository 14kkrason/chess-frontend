import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { MatchmakingService } from 'src/app/shared/matchmaking.service';
import { SocketService } from 'src/app/sockets/socket.service';

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
    private matchmaking: MatchmakingService
  ) {
    this.isSearchingGame = false;
    this.isLobbyCreated = false;
  }

  // TODO: create finding game
  ngOnInit(): void {
    this.foundGame$ = this.socketService.listen('found-game').subscribe({
      next: (data) => {
        console.log(data);
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
      next: (value) => {
        if(!value.game) {
          this.isLobbyCreated = true;
          console.log(value);
        }
        else {
          // TODO: redirecting is on 'found-game' listener
          // what do we do here? change counter value maybe?
          console.log(value);
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
    if(this.isLobbyCreated) {
      this.matchmaking.deleteLobby().then((value) => {
        console.log(value);
        this.isLobbyCreated = false;
      })
    }
    this.seconds = 0;
    this.timer = '00:00';
    this.isSearchingGame = false;
  }
}
