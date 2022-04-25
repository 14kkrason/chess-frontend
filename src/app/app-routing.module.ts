import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChessboardComponent } from './dashboard/chessboard/chessboard.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { TilesMenuComponent } from './dashboard/tiles-menu/tiles-menu.component';

import { LoginComponent } from './login/login-component/login.component';
import { RegisterComponent } from './login/register/register.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TilesMenuComponent },
      { path: 'game', component: ChessboardComponent },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), SharedModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
