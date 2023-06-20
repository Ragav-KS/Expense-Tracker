import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash-es';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';
import { Between } from 'typeorm';
import { AppState } from '../app.index';
import { selectDateRange } from '../settings/setting.selectors';
import {
  addTransaction,
  load,
  refresh,
  removeTransaction,
} from './transaction.actions';

@Injectable()
export class TransactionEffects {
  constructor(
    private actions$: Actions,
    private repoSrv: RepositoryService,
    private store: Store<AppState>
  ) {}

  refreshTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(refresh),
      concatLatestFrom(() => [this.store.select(selectDateRange)]),
      switchMap(async ([_, dateRange]) => {
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

  addTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTransaction),
      mergeMap(async ({ transaction }) => {
        await this.repoSrv.transactionsRepo.save(cloneDeep(transaction));
        await this.repoSrv.save();
      }),
      map(() => refresh())
    )
  );

  removeTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeTransaction),
      mergeMap(async ({ transaction }) => {
        await this.repoSrv.transactionsRepo.remove({ ...transaction });
        await this.repoSrv.save();
      }),
      map(() => refresh())
    )
  );
}
