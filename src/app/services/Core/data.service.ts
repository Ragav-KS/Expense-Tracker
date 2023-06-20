import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITransaction } from 'src/app/entities/transaction';
import { Between } from 'typeorm';
import { RepositoryService } from '../Repositories/repository.service';
import { CoreService } from './core.service';
import { Store } from '@ngrx/store';
import { load, refresh } from 'src/app/store/transaction/transaction.actions';
import { transactionStore } from 'src/app/store/transaction/transaction.reducer';
import { AppState } from 'src/app/store/app.index';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  transactionsList = new BehaviorSubject([] as ITransaction[]);
  expensesSum = new BehaviorSubject(0);
  incomeSum = new BehaviorSubject(0);

  constructor(
    private repoSrv: RepositoryService,
    private coreSrv: CoreService,
    private store: Store<AppState>
  ) {
    this.repoSrv.dataRefreshed.subscribe(() => {
      this.refresh();
    });
  }

  refresh() {
    let dateRange = this.coreSrv.displayDateRange;

    this.store.dispatch(refresh());

    this.repoSrv.transactionsRepo
      .sum('amount', {
        transactionType: 'debit',
        date: Between(dateRange.start, dateRange.end),
      })
      .then((sum) => {
        this.store.dispatch(load({ expensesSum: sum ? sum : 0 }));
        this.expensesSum.next(sum ? sum : 0);
      });

    this.repoSrv.transactionsRepo
      .sum('amount', {
        transactionType: 'credit',
        date: Between(dateRange.start, dateRange.end),
      })
      .then((sum) => {
        this.store.dispatch(load({ incomeSum: sum ? sum : 0 }));
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
