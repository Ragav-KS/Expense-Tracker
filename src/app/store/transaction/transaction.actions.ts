import { createAction, props } from '@ngrx/store';
import { ITransaction } from 'src/app/entities/transaction';

export const refresh = createAction(
  '[Transactions Component] refresh',
  props<{ transaction: ITransaction }>()
);

export const load = createAction(
  '[Transactions Component] load',
  props<{ list?: ITransaction[]; expensesSum?: number; incomeSum?: number }>()
);

export const addTransaction = createAction(
  '[Transactions Component] add',
  props<{ transaction: ITransaction }>()
);

export const removeTransaction = createAction(
  '[Transactions Component] remove',
  props<{ transaction: ITransaction }>()
);
