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
  }
}
