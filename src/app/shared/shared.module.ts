import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { MatchmakingService } from './matchmaking.service';

@NgModule({
  imports: [CommonModule],
  providers: [AuthService, AuthGuard, MatchmakingService],
})
export class SharedModule {}
