import { Injectable, ResolvedReflectiveFactory } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { resolve } from 'dns';
import { firstValueFrom, Observable, of } from 'rxjs';
import { filter, take, switchMap } from 'rxjs/operators';
import { AuthData } from 'src/app/state/models/auth-data.model';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      const value = await firstValueFrom(this.authService.refreshToken());
      if (!value.isLoggedIn) {
        this.router.navigateByUrl('/login');
        return false;
      }
      return true;
    } catch (e) {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
