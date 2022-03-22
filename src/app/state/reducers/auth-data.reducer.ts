import { createReducer, on } from '@ngrx/store';
import { logIn, logOut, refresh } from '../actions/auth-data.action';
import { AuthData } from '../models/auth-data.model';

export const initialAuthState: AuthData = {
  isLoggedIn: false,
  username: null,
  role: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(logIn, (_state, { isLoggedIn, username, role }) => {
    return { isLoggedIn, username, role };
  }),
  on(logOut, (_state) => {
    return initialAuthState;
  }),
  on(refresh, (_state, { isLoggedIn, username, role }) => {
    return { isLoggedIn, username, role };
  })
);
