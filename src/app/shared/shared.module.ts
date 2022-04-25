import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { MatchmakingService } from './matchmaking.service';
import { GameboardService } from './gameboard.service';

@NgModule({
  imports: [CommonModule],
  providers: [AuthService, AuthGuard, MatchmakingService, GameboardService],
})
export class SharedModule {}
