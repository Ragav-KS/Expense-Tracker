import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { CoreService } from 'src/app/services/Core/core.service';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';
import { Between } from 'typeorm';
import { load, refresh } from './transaction.actions';

@Injectable()
export class TransactionEffects {
  constructor(
    private actions$: Actions,
    private repoSrv: RepositoryService,
    private coreSrv: CoreService
  ) {}

  refreshTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(refresh),
      switchMap(async () => {
        const dateRange = this.coreSrv.displayDateRange;
        return {
          list: await this.repoSrv.transactionsRepo.find({
            order: {
              date: 'DESC',
            },
            where: {
              date: Between(dateRange.start, dateRange.end),
            },
          }),
          expensesSum: await this.repoSrv.transactionsRepo
            .sum('amount', {
              transactionType: 'debit',
              date: Between(dateRange.start, dateRange.end),
            })
            .then((sum) => (sum ? sum : 0)),
          incomeSum: await this.repoSrv.transactionsRepo
            .sum('amount', {
              transactionType: 'credit',
              date: Between(dateRange.start, dateRange.end),
            })
            .then((sum) => (sum ? sum : 0)),
        };
      }),
      map((payload) => load(payload))
    )
  );
}
