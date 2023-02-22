import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { concatMap, filter, firstValueFrom, from, Subscription } from 'rxjs';
import { Transaction } from 'src/app/entities/transaction';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit, OnDestroy {
  transactionsList: Transaction[] = [];
  transactionsGrouped: Map<number, Transaction[]> = new Map();

  private dataRefreshedSubscription!: Subscription;

  constructor(private repoSrv: RepositoryService) {}

  ngOnInit() {
    this.repoSrv.waitForRepo().then(() => {
      this.refresh();
    });

    this.dataRefreshedSubscription = this.repoSrv.dataRefreshed.subscribe(
      () => {
        this.refresh();
      }
    );
  }

  ngOnDestroy(): void {
    this.dataRefreshedSubscription.unsubscribe();
  }

  refresh() {
    from(
      this.repoSrv.transactionsRepo.find({
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
}
