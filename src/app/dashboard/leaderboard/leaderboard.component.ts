import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserSearchDialogComponent } from './user-search-dialog/user-search-dialog.component';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  // TODO: create type for records
  bullet!: any[];
  blitz!: any[];
  rapid!: any[];
  columns = ['position', 'username', 'elo'];
  // TODO: add minimum length of 3 letter
  searchForm = new FormGroup({
    search: new FormControl('', [Validators.maxLength(20)]),
  });

  constructor(
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  get search() {
    return this.searchForm.get('search');
  }

  ngOnInit(): void {
    this.http
      .get<any>('http://localhost:3000/api/leaderboard/records', {
        withCredentials: true,
        responseType: 'json',
      })
      .subscribe({
        next: (data) => {
          // data: { bullet: [...], blitz: [...], rapid: [...]  }
          this.bullet = data.bullet.map((elem: any, index: number) => {
            return { position: index + 1, ...elem };
          });
          this.blitz = data.blitz.map((elem: any, index: number) => {
            return { position: index + 1, ...elem };
          });
          this.rapid = data.rapid.map((elem: any, index: number) => {
            return { position: index + 1, ...elem };
          });
        },
      });
  }

  onSubmit() {
    if (this.searchForm.valid) {
      this.http
        .get<any>(
          `http://localhost:3000/api/leaderboard/user?username=${this.searchForm.value.search}`,
          {
            withCredentials: true,
            responseType: 'json',
          }
        )
        .subscribe({
          next: (response) => {
            this.dialog.open(UserSearchDialogComponent, {
              width: '20%',
              data: response.results,
            });
          },
        });
    }
  }

  onProfileClick(row: any) {
    this.router.navigate(['/dashboard','profile', row.username]);
  }
}
