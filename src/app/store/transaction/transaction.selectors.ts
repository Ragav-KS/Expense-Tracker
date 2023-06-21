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

export const selectGroupedTransactionsList = createSelector(
  selectTransactionFeature,
  (transactionStore) => {
    return groupTransactions(transactionStore.list);
  }
);

function groupTransactions(
  transactionsList: ITransaction[]
): Map<number, ITransaction[]> {
  let transactionsGrouped = new Map();

  transactionsList.forEach((transaction) => {
    const date = transaction.date;
    const dateKey = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
    const transactions = transactionsGrouped.get(dateKey);
    if (transactions) {
      transactions.push(transaction);
    } else {
      transactionsGrouped.set(dateKey, [transaction]);
    }
  });

  return transactionsGrouped;
}

export const selectExpensesSum = createSelector(
  selectTransactionFeature,
  (transactionStore) => transactionStore.expensesSum
);

export const selectIncomeSum = createSelector(
  selectTransactionFeature,
  (transactionStore) => transactionStore.incomeSum
);
