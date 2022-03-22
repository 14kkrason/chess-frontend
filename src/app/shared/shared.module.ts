import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AuthGuard } from './guards/auth.guard';

const socketConfig: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {
    transports: ['websocket']
  },
};

@NgModule({
  imports: [CommonModule, SocketIoModule.forRoot(socketConfig)],
  providers: [AuthService, AuthGuard],
})
export class SharedModule {}
