import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AuthData } from '../state/models/auth-data.model';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  refreshToken(loginAttempt = { loginAttempt: false }): Observable<AuthData> {
    return this.http
      .post<AuthData>(
        'http://localhost:3000/api/auth/refresh-token',
        loginAttempt,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
          responseType: 'json',
        }
      )
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  // TODO: create a universal headers config file

  login(user: any): Observable<AuthData> {
    return this.http
      .post<AuthData>(
        'http://localhost:3000/api/auth/login',
        {
          username: user.login,
          password: user.password,
        },
        {
          withCredentials: true,
          responseType: 'json',
        }
      )
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  logout(): Observable<any> {
    return this.http
      .post(
        'http://localhost:3000/api/auth/logout',
        {},
        {
          withCredentials: true,
          responseType: 'json',
        }
      )
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }
}
