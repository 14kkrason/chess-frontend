import { createAction, props } from '@ngrx/store';
import { AuthData } from '../models/auth-data.model';

export const logIn = createAction(
  '[Auth Data] Login',
  props<AuthData>()
);

export const logOut = createAction(
  '[Auth Data] Logout'
);

export const refresh = createAction(
  '[Auth Data] Refresh token',
  props<AuthData>()
)
