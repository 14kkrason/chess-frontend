import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisComponent } from './dashboard/analysis/analysis.component';
import { ChessboardComponent } from './dashboard/chessboard/chessboard.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { LeaderboardComponent } from './dashboard/leaderboard/leaderboard.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { TilesMenuComponent } from './dashboard/tiles-menu/tiles-menu.component';

import { LoginComponent } from './login/login-component/login.component';
import { RegisterComponent } from './login/register/register.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TilesMenuComponent },
      { path: 'game', component: ChessboardComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'analysis', component: AnalysisComponent },
      { path: 'analysis/:id', component: AnalysisComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
    SharedModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
