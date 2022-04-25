import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class SocketService {
  constructor(public socket: Socket, private router: Router) {}

  public reconnect() {
    this.socket.disconnect();
    this.socket.connect();
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public listen(event: any) {
    console.log('Listening to', event);
    return this.socket.fromEvent<any>(event);
  }

  public emit(event: string, payload: any) {
    this.socket.emit(event, payload);
  }
}
