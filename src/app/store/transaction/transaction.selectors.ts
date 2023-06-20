import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITransaction } from 'src/app/entities/transaction';
import { transactionStore } from './transaction.reducer';
import { AppState } from '../app.index';

const selectTransactionFeature =
  createFeatureSelector<transactionStore>('transaction');

export const selectTransactionsList = createSelector(
  selectTransactionFeature,
  (transactionStore) => transactionStore.list
);

export const selectExpensesSum = createSelector(
  selectTransactionFeature,
  (transactionStore) => transactionStore.expensesSum
);

export const selectIncomeSum = createSelector(
  selectTransactionFeature,
  (transactionStore) => transactionStore.incomeSum
);
