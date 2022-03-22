import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, take, switchMap } from 'rxjs/operators';
import { AuthData } from 'src/app/state/models/auth-data.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<{ auth: AuthData }>,
    private router: Router
  ) {}

  checkLoginStatus(): Observable<AuthData> {
    return this.store.select('auth').pipe(
      take(1)
    )
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkLoginStatus().pipe(
      switchMap((auth: AuthData) => {
        if(!auth.isLoggedIn) {
          this.router.navigate(['/login']);
        }
        return of(auth.isLoggedIn)})
    )
  }
}
