import { createAction, props } from '@ngrx/store';

export const setLoginState = createAction(
  '[GAuth] Set Login state',
  props<{ loggedIn: boolean; account: string }>()
);

export const login = createAction(
  '[GAuth] Do Login',
  props<{ account?: string }>()
);
