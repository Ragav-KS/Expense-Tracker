import { Injectable } from '@angular/core';
import { RepositoryService } from '../Repositories/repository.service';
import { CoreService } from './core.service';
import { Between } from 'typeorm';
import { ITransaction } from 'src/app/entities/transaction';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  transactionsList = new BehaviorSubject([] as ITransaction[]);
  expensesSum = new BehaviorSubject(0);
  incomeSum = new BehaviorSubject(0);

  constructor(
    private repoSrv: RepositoryService,
    private coreSrv: CoreService
  ) {
    this.repoSrv.dataRefreshed.subscribe(() => {
      this.refresh();
    });
  }

  refresh() {
    let dateRange = this.coreSrv.displayDateRange;

    this.repoSrv.transactionsRepo
      .find({
        order: {
          date: 'DESC',
        },
        where: {
          date: Between(dateRange.start, dateRange.end),
        },
      })
      .then((transactions) => {
        this.transactionsList.next(transactions);
        console.log('>>>> [Data] transactions loaded');
      });

    this.repoSrv.transactionsRepo
      .sum('amount', {
        transactionType: 'debit',
        date: Between(dateRange.start, dateRange.end),
      })
      .then((sum) => {
        this.expensesSum.next(sum ? sum : 0);
      });

    this.repoSrv.transactionsRepo
      .sum('amount', {
        transactionType: 'credit',
        date: Between(dateRange.start, dateRange.end),
      })
      .then((sum) => {
        this.incomeSum.next(sum ? sum : 0);
      });
  }

  async deleteTransaction(transaction: ITransaction) {
    this.repoSrv.transactionsRepo.remove(transaction).then(() => {
      this.repoSrv.save();
    });
  }

  async createTransaction(transaction: ITransaction) {
    this.repoSrv.transactionsRepo.save(transaction).then(() => {
      this.repoSrv.save();
    });
  }
}
