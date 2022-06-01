import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthData } from 'src/app/state/models/auth-data.model';
import { GameData } from 'src/app/state/models/game-data.model';

@Component({
  selector: 'app-tiles-menu',
  templateUrl: './tiles-menu.component.html',
  styleUrls: ['./tiles-menu.component.scss'],
})
export class TilesMenuComponent implements OnInit {
  authData$!: Subscription;
  authData!: AuthData;

  constructor(
    private readonly router: Router,
    private readonly store: Store<{ auth: AuthData; game: GameData }>
  ) {}

  ngOnInit(): void {
    this.authData$ = this.store.select('auth').subscribe({
      next: (auth: AuthData) => {
        this.authData = auth;
      },
      error: (error) => {
        console.error(error.message);
      },
    });
  }

  onLeaderboard() {
    this.router.navigate(['/dashboard/leaderboard']);
  }

  onMyStats() {
    this.router.navigate(['/dashboard', 'profile', this.authData.username]);
  }

  onAnalysis() {
    this.router.navigate(['/dashboard', 'analysis']);
  }
}
