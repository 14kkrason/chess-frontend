import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { SocketService } from './socket.service';

const socketConfig: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {
    transports: ['websocket']
  },
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SocketIoModule.forRoot(socketConfig)
  ],
  providers: [SocketService]
})
export class SocketsModule { }
