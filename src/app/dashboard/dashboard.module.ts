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
import { NgxChessBoardModule } from 'ngx-chess-board';
import { CountdownModule } from 'ngx-countdown';
import { GameInformationDialogComponent } from './chessboard/game-information-dialog/game-information-dialog.component';
import { DrawOfferDialogComponent } from './chessboard/draw-offer-dialog/draw-offer-dialog.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { UserSearchDialogComponent } from './leaderboard/user-search-dialog/user-search-dialog.component';
import { ProfileComponent } from './profile/profile.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AnalysisComponent } from './analysis/analysis.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';
import { ConfirmPasswordDialogComponent } from './settings/confirm-password-dialog/confirm-password-dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
    FindGameDialogComponent,
    ChessboardComponent,
    TilesMenuComponent,
    GameInformationDialogComponent,
    DrawOfferDialogComponent,
    LeaderboardComponent,
    UserSearchDialogComponent,
    ProfileComponent,
    AnalysisComponent,
    SettingsComponent,
    ConfirmPasswordDialogComponent,
  ],
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
    CountdownModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxChartsModule,
    MatDividerModule,
    MatPaginatorModule,
    MatProgressBarModule,
    FormsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatExpansionModule,
  ],
})
export class DashboardModule {}
