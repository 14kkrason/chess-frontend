import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-search-dialog',
  templateUrl: './user-search-dialog.component.html',
  styleUrls: ['./user-search-dialog.component.scss'],
})
export class UserSearchDialogComponent implements OnInit {
  searchResults: any[];
  columns = ['position', 'username'];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private readonly router: Router,
    private dialog: MatDialogRef<UserSearchDialogComponent>,
  ) {
    // TODO: check if it's scrollable on more than 3 elements
    this.searchResults = this.data.map((element: any, index: number) => {
      return { position: index + 1, ...element };
    });
  }

  ngOnInit(): void {}

  onProfileClick(row: any) {
    // redirect to profile page
    this.router.navigate(['/dashboard','profile', row.username]);
    this.dialog.close();
  }
}
