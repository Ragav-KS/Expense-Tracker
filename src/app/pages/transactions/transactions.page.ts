import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { concatMap, filter, firstValueFrom, from } from 'rxjs';
import { Transaction } from 'src/app/entities/transaction';
import { SqliteStorageService } from 'src/app/services/Storage/sqlite-storage.service';
import { Repository } from 'typeorm';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  transactionsList: Transaction[] = [];
  transactionsGrouped: Map<number, Transaction[]> = new Map();

  private transactionsRepo!: Repository<Transaction>;

  constructor(private sqliteSrv: SqliteStorageService) {}

  ngOnInit() {
    this.loadRepo().then(() => {
      from(
        this.transactionsRepo.find({
          order: {
            date: 'DESC',
          },
        })
      )
        .pipe(
          concatMap((transactions) => from(transactions)),
          filter((transaction) => {
            return transaction['amount'] != null;
          })
        )
        .subscribe({
          next: (transaction) => {
            this.transactionsList.push(transaction);
          },
          complete: () => {
            console.log('>>>> [page] transactions loaded');
            this.groupTransactions();
          },
        });
    });
  }

  groupTransactions() {
    this.transactionsList.forEach((transaction) => {
      const date = transaction.date;
      const dateKey = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).getTime();
      const transactions = this.transactionsGrouped.get(dateKey);
      if (transactions) {
        transactions.push(transaction);
      } else {
        this.transactionsGrouped.set(dateKey, [transaction]);
      }
    });
  }

  keyDescOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => {
    return a.key > b.key ? -1 : b.key > a.key ? 1 : 0;
  };

  async loadRepo() {
    if (!this.sqliteSrv.DBReady) {
      await firstValueFrom(this.sqliteSrv.DBReadyEmitter);
    }

    this.transactionsRepo = this.sqliteSrv.AppDataSource.getRepository(
      'Transactions'
    ) as Repository<Transaction>;
    console.info('>>>> [sqlite] Repository Loaded');
  }
}
