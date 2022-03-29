import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Observable,
  timeInterval,
  merge,
  interval,
  mergeMap,
  Subscriber,
  Subscription,
  take,
} from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { SocketService } from 'src/app/sockets/socket.service';
import { logOut, refresh } from 'src/app/state/actions/auth-data.action';
import { AuthData } from 'src/app/state/models/auth-data.model';
import { FindGameDialogComponent } from '../find-game-dialog/find-game-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  authData$: Observable<AuthData>;
  refreshInterval$!: Subscription;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private store: Store<{ auth: AuthData }>,
    private authService: AuthService,
    private socketService: SocketService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.matIconRegistry.addSvgIcon(
      `pawn`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../../assets/pawn.svg`)
    );
    this.authData$ = this.store.select('auth');
  }

  // TODO: setup socket.io service/module - shared or separate? share I think
  // TODO: create findGameDialog
  ngOnInit(): void {
    this.refreshInterval$ = interval(5 * 60 * 1000)
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
          this.router.navigate(['/']);
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
  }

  ngOnDestroy() {
    console.debug('Killing refresh interval.');
    this.refreshInterval$.unsubscribe();
  }

  onLogoClick() {
    this.router.navigate(['/dashboard']);
  }

  onProfileClick() {
    // TODO: create profiles
    this.http
      .get('http://localhost:3000/api/auth/data', {
        withCredentials: true,
      })
      .subscribe((value) => {
        console.log(value);
      });
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
}
