import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { interval, mergeMap, Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { SocketService } from 'src/app/sockets/socket.service';
import { logOut, refresh } from 'src/app/state/actions/auth-data.action';
import { endGame, refreshGame } from 'src/app/state/actions/game-data.action';
import { AuthData } from 'src/app/state/models/auth-data.model';
import { GameData } from 'src/app/state/models/game-data.model';
import { FindGameDialogComponent } from '../find-game-dialog/find-game-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  authData$: Subscription;
  gameData$: Subscription;
  refreshInterval$!: Subscription;
  // TODO: move this button to tile-menu
  isGameGoing = false;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private store: Store<{ auth: AuthData; game: GameData }>,
    private authService: AuthService,
    private socketService: SocketService,
    private dialog: MatDialog
  ) {
    this.matIconRegistry.addSvgIcon(
      `pawn`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../../assets/pawn.svg`)
    );
    this.authData$ = this.store.select('auth').subscribe({
      next: (auth: AuthData) => {
        console.debug(auth);
      },
      error: (error) => {
        console.error(error.message);
      },
    });

    this.gameData$ = this.store.select('game').subscribe({
      next: (game: GameData) => {
        // TODO: here we make GAME ACTIVE button (in)visible
        // if the game.isGameGoint -> visible
        // otherwise invisible
        if (game.isGameGoing) {
          this.isGameGoing = true;
        } else {
          this.isGameGoing = false;
        }
      },
      error: (error) => {
        console.error(error.message);
      },
    });
  }

  // TODO: refactor subscription teardown into a Destroy class similar to:
  // https://dev.to/this-is-angular/dry-way-to-manage-subscriptions-in-angular-components-256j

  ngOnInit(): void {
    this.refreshInterval$ = interval(10 * 60 * 1000)
      .pipe(mergeMap(() => this.authService.refreshToken()))
      .subscribe({
        next: (data: AuthData) => {
          console.log(data);
          if (data.isLoggedIn) {
            this.socketService.reconnect();
            this.store.dispatch(refresh(data));
          }
        },
        error: (error) => {
          console.error(error.message);
          this.store.dispatch(logOut());
        },
      });

    this.authService
      .refreshToken()
      .pipe(take(1))
      .subscribe({
        next: (auth) => {
          this.store.dispatch(refresh(auth));
        },
        error: (error) => {
          console.error(error.message);
        },
      });

    this.store.dispatch(refreshGame());
  }

  ngOnDestroy() {
    console.debug('Killing refresh interval.');
    if (this.refreshInterval$) {
      this.refreshInterval$.unsubscribe();
    }
  }

  onLogoClick() {
    this.router.navigate(['/dashboard']);
  }

  onSettingsClick() {
    // TODO: create profiles
    this.router.navigate(['/dashboard', 'settings']);
  }

  onFindGame() {
    this.dialog.open(FindGameDialogComponent, {
      height: '85%',
      width: '40%',
    });
  }

  onLogout() {
    this.socketService.disconnect();
    this.authService.logout().subscribe({
      next: (message) => {
        console.log(message);
        this.store.dispatch(logOut());
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error.message);
      },
    });
  }

  onGoToGame() {
    this.router.navigate(['/dashboard/game']);
  }
}
