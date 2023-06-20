import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITransaction } from 'src/app/entities/transaction';
import { transactionStore } from './transaction.reducer';
import { AppState } from '../app.index';

export const selectTransactionsList = createSelector(
  (state: AppState) => state.transaction,
  (transactionStore) => transactionStore.list
);

export const selectExpensesSum = createSelector(
  (state: AppState) => state.transaction,
  (transactionStore) => transactionStore.expensesSum
);

export const selectIncomeSum = createSelector(
  (state: AppState) => state.transaction,
  (transactionStore) => transactionStore.incomeSum
);
