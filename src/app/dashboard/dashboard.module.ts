import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';

import { HttpClientModule } from '@angular/common/http';
import { FindGameDialogComponent } from './find-game-dialog/find-game-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { SocketsModule } from '../sockets/sockets.module';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChessboardComponent } from './chessboard/chessboard.component';
import { TilesMenuComponent } from './tiles-menu/tiles-menu.component';
import { RouterModule } from '@angular/router';
import { NgxChessBoardModule } from "ngx-chess-board";
import { CountdownModule } from 'ngx-countdown';
import { GameInformationDialogComponent } from './chessboard/game-information-dialog/game-information-dialog.component';

@NgModule({
  declarations: [DashboardComponent, FindGameDialogComponent, ChessboardComponent, TilesMenuComponent, GameInformationDialogComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    SocketsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    RouterModule,
    NgxChessBoardModule.forRoot(),
    CountdownModule
  ],
})
export class DashboardModule {}
