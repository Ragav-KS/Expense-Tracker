import { createFeatureSelector, createSelector } from '@ngrx/store';
import { transactionStore } from './transaction.reducer';
import { groupTransactions } from './transaction.util';

const selectTransactionFeature =
  createFeatureSelector<transactionStore>('transaction');

export const selectTransactionsList = createSelector(
  selectTransactionFeature,
  (transactionStore) => transactionStore.list
);

export const selectGroupedTransactionsList = createSelector(
  selectTransactionFeature,
  (transactionStore) => {
    return groupTransactions(transactionStore.list);
  }
);

export const selectExpensesSum = createSelector(
  selectTransactionFeature,
  (transactionStore) => transactionStore.expensesSum
);

export const selectIncomeSum = createSelector(
  selectTransactionFeature,
  (transactionStore) => transactionStore.incomeSum
);
