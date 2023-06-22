import { createReducer, on } from '@ngrx/store';
import { ITransaction } from 'src/app/entities/transaction';
import { load } from './transaction.actions';

export interface TransactionStore {
  list: ITransaction[];
  expensesSum: number;
  incomeSum: number;
}

export const initialState: TransactionStore = {
  list: [],
  expensesSum: 0,
  incomeSum: 0,
};

export const transactionReducer = createReducer(
  initialState,
  on(load, (state, action) => {
    return {
      list: action.list ? action.list : state.list,
      expensesSum: action.expensesSum ? action.expensesSum : state.expensesSum,
      incomeSum: action.incomeSum ? action.incomeSum : state.incomeSum,
    };
  })
);
