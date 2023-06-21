import { ITransaction } from 'src/app/entities/transaction';

export function groupTransactions(
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
