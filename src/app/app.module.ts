import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './login/login.module';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './state/reducers/auth-data.reducer';
import { HttpClientModule } from '@angular/common/http';
import { DashboardModule } from './dashboard/dashboard.module';
import { CountdownModule } from 'ngx-countdown';
import { gameReducer } from './state/reducers/game-data.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoginModule,
    StoreModule.forRoot({ auth: authReducer, game: gameReducer }),
    HttpClientModule,
    DashboardModule,
    CountdownModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
