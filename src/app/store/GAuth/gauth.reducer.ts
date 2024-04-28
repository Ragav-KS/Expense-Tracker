import { createReducer, on } from '@ngrx/store';
import { setLoginState } from './gauth.actions';

export interface GAuthStore {
  loggedIn: boolean;
  account: string;
}

const initialState: GAuthStore = {
  loggedIn: false,
  account: '',
};

export const gAuthReducer = createReducer(
  initialState,
  on(setLoginState, (state, { loggedIn, account }) => {
    return Object.assign({}, state, {
      loggedIn: loggedIn,
      account: account,
    });
  })
);
