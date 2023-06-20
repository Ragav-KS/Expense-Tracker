import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { ITransaction } from 'src/app/entities/transaction';
import { AppState } from 'src/app/store/app.index';
import { refresh } from 'src/app/store/transaction/transaction.actions';
import { RepositoryService } from '../Repositories/repository.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  transactionsList = new BehaviorSubject([] as ITransaction[]);
  expensesSum = new BehaviorSubject(0);
  incomeSum = new BehaviorSubject(0);

  constructor(
    private repoSrv: RepositoryService,
    private store: Store<AppState>
  ) {
    this.repoSrv.dataRefreshed.subscribe(() => {
      // this.refresh();
    });
  }

  refresh() {
    this.store.dispatch(refresh());
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
