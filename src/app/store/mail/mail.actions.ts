import { createAction, props } from '@ngrx/store';

export const loadMails = createAction('[Mail] load from Mails');

export const loadTransactionMail = createAction(
  '[Mail] load transaction from Mail',
  props<{ mailId: string }>()
);
