import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, Observable } from 'rxjs';
import { Lobby } from './interfaces/lobby.interface';

@Injectable()
export class MatchmakingService {

  constructor(private http: HttpClient) { }

  findGame(type: string): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3000/api/game-management/match',
      {
        type: type,
      },
      {
        withCredentials: true,
        responseType: 'json'
      }
    )
    .pipe(
      catchError((error) => {
        throw error;
      })
    )
  }

  deleteLobby() {
    const req = this.http.delete(
      'http://localhost:3000/api/game-management/lobby',
      {
        withCredentials: true,
        responseType: 'json'
      }
    )

    return firstValueFrom(req);
  }
}

